const path = require("node:path");
const { createApp, text, HttpError } = require("./http.cjs");
function buildServer({
  database = path.join(__dirname, "../.data/demo.sqlite"),
  fetchImpl = fetch,
  token = process.env.TMDB_API_KEY,
} = {}) {
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
    extraRoute: async (req, res, url, { send }) => {
      if (!url.pathname.startsWith("/api/movies")) return false;
      if (req.method !== "GET") throw new HttpError(405, "Method not allowed.");
      if (!token)
        throw new HttpError(
          503,
          "Configure TMDB_API_KEY in the backend environment.",
        );
      let endpoint;
      if (url.pathname === "/api/movies") endpoint = "/discover/movie";
      else if (url.pathname === "/api/movies/search")
        endpoint = "/search/movie";
      else if (/^\/api\/movies\/\d+(\/videos)?$/.test(url.pathname))
        endpoint = url.pathname.replace("/api/movies", "/movie");
      else throw new HttpError(404, "Movie route not found.");
      const query = new URLSearchParams({
        api_key: token,
        language: "en-US",
        include_adult: "false",
      });
      if (endpoint === "/search/movie")
        query.set("query", text(url.searchParams.get("query"), "Search", 200));
      if (endpoint === "/discover/movie") {
        const page = Number(url.searchParams.get("page") || 1);
        if (!Number.isInteger(page) || page < 1 || page > 500)
          throw new HttpError(400, "Invalid page.");
        query.set("page", String(page));
        const sorts = {
          newest: "release_date.desc",
          oldest: "release_date.asc",
          most_viewed: "popularity.desc",
          relevant: "vote_average.desc",
        };
        query.set(
          "sort_by",
          sorts[url.searchParams.get("sort")] || "popularity.desc",
        );
        if (url.searchParams.get("sort") === "relevant")
          query.set("vote_count.gte", "100");
      }
      let upstream;
      try {
        upstream = await fetchImpl(
          `https://api.themoviedb.org/3${endpoint}?${query}`,
          { signal: AbortSignal.timeout(10000) },
        );
      } catch {
        throw new HttpError(
          502,
          "Movie provider is unavailable. Please retry.",
        );
      }
      if (!upstream.ok)
        throw new HttpError(502, "Movie provider request failed.");
      send(res, 200, await upstream.json());
      return true;
    },
  });
}
if (require.main === module)
  buildServer().listen(Number(process.env.PORT || 4000), "127.0.0.1", () =>
    console.log("Movie API: http://localhost:4000"),
  );
module.exports = { buildServer };
