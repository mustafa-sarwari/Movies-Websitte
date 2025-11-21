const API_KEY=import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL="api.themoviedb.org/3";

// Mock data for testing when API key is not available
const mockMovies = [
    {
        id: 1,
        title: "The Shawshank Redemption",
        poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        release_date: "1994-09-23"
    },
    {
        id: 2,
        title: "The Godfather",
        poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        release_date: "1972-03-14"
    },
    {
        id: 3,
        title: "The Dark Knight",
        poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        release_date: "2008-07-16"
    }
];

export const getPouplarMovies = async () => {
    // Use mock data if API key is not set
    if (!API_KEY || API_KEY === 'test_key_for_local_testing') {
        return mockMovies;
    }
    const response = await fetch ( `https://${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
}

export const searchMovies = async (query) => {
    // Use mock data if API key is not set
    if (!API_KEY || API_KEY === 'test_key_for_local_testing') {
        return mockMovies.filter(movie => 
            movie.title.toLowerCase().includes(query.toLowerCase())
        );
    }
    const response = await fetch ( 
        `https://${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.results;
}