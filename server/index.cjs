const path = require("node:path");
const { randomUUID } = require("node:crypto");
const { createApp, text, HttpError } = require("./http.cjs");

const TMDB_CACHE_TTL_MS = 5 * 60 * 1000;
function createTmdbClient(fetchImpl, token) {
  const cache = new Map();
  const inflight = new Map();
  async function request(endpoint, query) {
    const params = new URLSearchParams({
      api_key: token,
      language: "en-US",
      include_adult: "false",
      ...query,
    });
    const key = `${endpoint}?${params.toString()}`;
    const cached = cache.get(key);
    if (cached && cached.expiresAt > Date.now()) return cached.body;
    if (inflight.has(key)) return inflight.get(key);
    const pending = (async () => {
      let upstream;
      try {
        upstream = await fetchImpl(`https://api.themoviedb.org/3${key}`, {
          signal: AbortSignal.timeout(10000),
        });
      } catch {
        throw new HttpError(502, "Movie provider is unavailable. Please retry.");
      }
      if (!upstream.ok) throw new HttpError(502, "Movie provider request failed.");
      const body = await upstream.json();
      cache.set(key, { expiresAt: Date.now() + TMDB_CACHE_TTL_MS, body });
      return body;
    })();
    inflight.set(key, pending);
    try {
      return await pending;
    } finally {
      inflight.delete(key);
    }
  }
  return { request };
}

function demoOwner(req, res, secureCookies) {
  let guest = req.headers.cookie?.match(
    /(?:^|;\s*)demo_session=([a-f0-9-]{36})(?:;|$)/,
  )?.[1];
  if (!guest) {
    guest = randomUUID();
    res.setHeader(
      "Set-Cookie",
      `demo_session=${guest}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400${secureCookies ? "; Secure" : ""}`,
    );
  }
  return guest;
}

function scoreCandidates(candidates, weights) {
  return candidates
    .map((movie) => {
      const genres = Array.isArray(movie.genre_ids) ? movie.genre_ids : [];
      const signal = genres.reduce((sum, id) => sum + (weights.get(id) || 0), 0);
      // Recommendation score = weighted genre overlap / sqrt(genre count) + quality + popularity.
      // This keeps genre affinity as the primary signal while avoiding bias toward movies with
      // many listed genres; vote average and popularity are small tie-breakers.
      const score =
        signal / Math.sqrt(Math.max(genres.length, 1)) +
        (Number(movie.vote_average) || 0) * 0.05 +
        (Number(movie.popularity) || 0) * 0.001;
      return { movie, score };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        (b.movie.popularity || 0) - (a.movie.popularity || 0) ||
        b.movie.id - a.movie.id,
    )
    .map((row) => row.movie);
}

function buildServer({
  database = path.join(__dirname, "../.data/demo.sqlite"),
  fetchImpl = fetch,
  token = process.env.TMDB_API_KEY,
} = {}) {
  const tmdb = token ? createTmdbClient(fetchImpl, token) : null;
  const secureCookies = process.env.COOKIE_SECURE === "true";
  return createApp({
    workspace: require("./workspace.cjs"),
    spaFallback: true,
    root: path.join(__dirname, "../dist"),
    database,
    allowedOrigins: ["http://localhost:5173", "http://127.0.0.1:5173"],
    resources: {
      favorites: {
        validate(body) {
          if (!Number.isInteger(body.movieId) || body.movieId < 1)
            throw new HttpError(400, "Invalid movie ID.");
          return {
            movieId: body.movieId,
            title: text(body.title, "Title", 200),
            poster_path:
              typeof body.poster_path === "string"
                ? body.poster_path.slice(0, 200)
                : null,
            release_date:
              typeof body.release_date === "string"
                ? body.release_date.slice(0, 10)
                : "",
          };
        },
      },
    },
    extraRoute: async (req, res, url, { send, rowsFor, user }) => {
      if (
        !url.pathname.startsWith("/api/movies") &&
        url.pathname !== "/api/recommendations"
      )
        return false;
      if (req.method !== "GET") throw new HttpError(405, "Method not allowed.");
      if (!tmdb)
        throw new HttpError(
          503,
          "Configure TMDB_API_KEY in the backend environment.",
        );
      if (url.pathname === "/api/recommendations") {
        const owner = user?.id || demoOwner(req, res, secureCookies);
        const favorites = rowsFor("favorites", owner);
        const favoriteIds = new Set(favorites.map((row) => row.movieId));
        if (!favoriteIds.size)
          return (send(res, 200, { results: [], favoritesCount: 0 }), true);
        const detailRows = await Promise.all(
          [...favoriteIds].map((id) => tmdb.request(`/movie/${id}`)),
        );
        const weights = new Map();
        for (const detail of detailRows)
          for (const genre of detail.genres || [])
            weights.set(genre.id, (weights.get(genre.id) || 0) + 1);
        const topGenres = [...weights.entries()]
          .sort((a, b) => b[1] - a[1] || a[0] - b[0])
          .slice(0, 5)
          .map(([id]) => id);
        if (!topGenres.length)
          return (
            send(res, 200, { results: [], favoritesCount: favoriteIds.size }),
            true
          );
        const [firstPage, secondPage] = await Promise.all([
          tmdb.request("/discover/movie", {
            page: "1",
            sort_by: "popularity.desc",
            with_genres: topGenres.join(","),
          }),
          tmdb.request("/discover/movie", {
            page: "2",
            sort_by: "popularity.desc",
            with_genres: topGenres.join(","),
          }),
        ]);
        const pool = [...(firstPage.results || []), ...(secondPage.results || [])]
          .filter((movie) => !favoriteIds.has(movie.id))
          .filter((movie, index, all) => all.findIndex((row) => row.id === movie.id) === index);
        send(res, 200, {
          results: scoreCandidates(pool, weights).slice(0, 20),
          favoritesCount: favoriteIds.size,
        });
        return true;
      }
      let endpoint;
      if (url.pathname === "/api/movies") endpoint = "/discover/movie";
      else if (url.pathname === "/api/movies/search")
        endpoint = "/search/movie";
      else if (/^\/api\/movies\/\d+(\/videos)?$/.test(url.pathname))
        endpoint = url.pathname.replace("/api/movies", "/movie");
      else throw new HttpError(404, "Movie route not found.");
      const query = {};
      if (endpoint === "/search/movie")
        query.query = text(url.searchParams.get("query"), "Search", 200);
      if (endpoint === "/discover/movie") {
        const page = Number(url.searchParams.get("page") || 1);
        if (!Number.isInteger(page) || page < 1 || page > 500)
          throw new HttpError(400, "Invalid page.");
        query.page = String(page);
        const sorts = {
          newest: "release_date.desc",
          oldest: "release_date.asc",
          most_viewed: "popularity.desc",
          relevant: "vote_average.desc",
        };
        query.sort_by = sorts[url.searchParams.get("sort")] || "popularity.desc";
        if (url.searchParams.get("sort") === "relevant")
          query["vote_count.gte"] = "100";
      }
      send(res, 200, await tmdb.request(endpoint, query));
      return true;
    },
  });
}
if (require.main === module)
  buildServer().listen(Number(process.env.PORT || 4000), "127.0.0.1", () =>
    console.log("Movie API: http://localhost:4000"),
  );
module.exports = { buildServer };
