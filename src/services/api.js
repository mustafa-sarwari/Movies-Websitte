export async function movieRequest(path, signal) {
  const response = await fetch('/api/movies' + path, { signal });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'Unable to load movies.');
  return body;
}
export async function getPopularMovies(page = 1, sort = 'most_viewed', signal) {
  const body = await movieRequest(`?page=${page}&sort=${encodeURIComponent(sort)}`, signal);
  return Array.isArray(body.results) ? body.results : [];
}
export async function searchMovies(query, signal) {
  const body = await movieRequest(`/search?query=${encodeURIComponent(query)}`, signal);
  return Array.isArray(body.results) ? body.results : [];
}
export async function getRecommendations(signal) {
  const body = await movieRequest('/recommendations', signal);
  return {
    results: Array.isArray(body.results) ? body.results : [],
    favoritesCount: Number.isInteger(body.favoritesCount) ? body.favoritesCount : 0,
  };
}
