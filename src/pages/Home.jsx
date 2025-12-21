import { useState, useEffect } from "react";
import { searchMovies, getPopularMovies  } from "../services/api";
import MovieCard from "../components/MovieCard";
import "../CSS/Home.css";


function Home() {
const [searchQuery, setSearchQuery] = useState("");
const [movies, setMovies] = useState([]);
const [error, setError] = useState(null);
const [loading, setLoading] = useState(true);
const [currentPage, setCurrentPage] = useState(1);
const [isSearchMode, setIsSearchMode] = useState(false);
const [sortBy, setSortBy] = useState('most_viewed');
const totalPages = 20; // 20 pages × 50 movies = 1000 movies

    useEffect(() => {
        const loadPopularMovies = async () => {
            setLoading(true);
            try {
                const popularMovies = await getPopularMovies(currentPage, sortBy);
                setMovies(popularMovies);
            } catch (err) {
                console.log(err)
                setError("Failed to load movies...")
            }

                finally{
                    setLoading(false)
                }
        }
        
        if (!isSearchMode) {
            loadPopularMovies();
        }
    }, [currentPage, isSearchMode, sortBy])

    const handleSearch = async (e) => {
        e.preventDefault();
        if(!searchQuery.trim()) return
        if(loading) return
        setLoading(true)
        setIsSearchMode(true);

        try{
            const searchResults = await searchMovies(searchQuery)
            setMovies(searchResults)
            setError(null)
        } catch (err){
            console.log(err)
            setError("Failed to search movies...")
        } finally {
            setLoading(false)
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setIsSearchMode(false);
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1); // Reset to first page when sorting changes
    };
    
    return (
     <div className="home">
         
        <form onSubmit={handleSearch} className="search-form">
            <input type="text" 
            placeholder="Search for movies..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button type="submit" className="search-button" >Search</button>
            {isSearchMode && (
                <button type="button" className="clear-button" onClick={handleClearSearch}>
                    Clear
                </button>
            )}
        </form>

        {!isSearchMode && (
            <div className="sort-container">
                <label htmlFor="sort-select" className="sort-label">Sort by:</label>
                <select 
                    id="sort-select"
                    value={sortBy} 
                    onChange={handleSortChange}
                    className="sort-select"
                >
                    <option value="most_viewed">Most Viewed</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="relevant">Highest Rated</option>
                </select>
            </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {loading ? (<div className="loading">Loading...</div>) :(
        <>
        <div className="movies-grid">
            {movies && movies.map( movie => (<MovieCard movie={movie} key={movie.id}/>
        ))}
        </div>

        {!isSearchMode && movies.length > 0 && (
            <div className="pagination">
                <button 
                    className="pagination-btn" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                
                <div className="pagination-info">
                    <span className="page-number">Page {currentPage} of {totalPages}</span>
                </div>

                <button 
                    className="pagination-btn" 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        )}
        </>
        )}
     </div>
    );
}

export default Home;