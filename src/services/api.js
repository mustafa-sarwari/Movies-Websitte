const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";



export const getPopularMovies = async (page = 1, sortBy = 'popularity.desc') => {
    // Fetch 3 pages at once to get 50-60 movies per request
    // TMDB returns ~20 movies per page
    const startPage = (page - 1) * 3 + 1; // Calculate which TMDB pages to fetch
    
    // Map sort options to TMDB parameters
    const sortMapping = {
        'newest': 'release_date.desc',
        'oldest': 'release_date.asc',
        'most_viewed': 'popularity.desc',
        'relevant': 'vote_average.desc'
    };
    
    const sortParam = sortMapping[sortBy] || 'popularity.desc';
    const minVotes = sortBy === 'relevant' ? '&vote_count.gte=100' : ''; // Filter for rated movies
    
    const responses = await Promise.all([
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${startPage}&sort_by=${sortParam}${minVotes}&include_adult=false&language=en-US`),
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${startPage + 1}&sort_by=${sortParam}${minVotes}&include_adult=false&language=en-US`),
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${startPage + 2}&sort_by=${sortParam}${minVotes}&include_adult=false&language=en-US`)
    ]);
    
    const data = await Promise.all(responses.map(res => res.json()));
    
    // Combine results and return 50 movies
    const allMovies = [...data[0].results, ...data[1].results, ...data[2].results];
    return allMovies.slice(0, 50);
}

export const searchMovies = async (query) => {
    const response = await fetch ( 
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US`);
    const data = await response.json();
    return data.results;
}