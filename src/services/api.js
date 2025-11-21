const API_KEY=process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL="api.themoviedb.org/3";


export const getPouplarMovies = async () => {
    const response = await fetch ( `https://${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
}

export const searchMovies = async (query) => {
    const response = await fetch ( 
        `https://${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.results;
}