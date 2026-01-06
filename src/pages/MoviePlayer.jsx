import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMovieContext } from "../context/MovieContext";
import "../CSS/MoviePlayer.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";


function MoviePlayer(){

    const { id } = useParams();
    const navigate = useNavigate();
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
    const [trailerKey, setTrailerKey] = useState(null);
    const [movie, setMovie] = useState(null);

    useEffect(() => {

        //fetch movie trailer
        fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`)
            .then( res => res.json())
            .then(data => {
                const trailer = data.results.find(vid => vid.type === "Trailer" && vid.site === "YouTube");
                 setTrailerKey(trailer?.key);
            })

        //fetch movie info

        fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`)
            .then( res => res.json())
            .then(setMovie); 
    }, [id]);

    const numericId = Number(id);
    const favorite = isFavorite(numericId);

    function onFavoriteClick(e) {
        e.preventDefault();
        if(favorite) removeFromFavorites(numericId);
        else addToFavorites(movie);
    }

    if(!trailerKey || !movie) return <p className="loading">Loading...</p>;

    return (
        <div className="player-page">

            <div className="player-top">
                <button 
                    onClick={() => navigate(-1)}
                    className="close-btn"
                >
                    ✕
                </button>
            </div>

            <div className="player-content">

                <div className="player-video">
                    <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title="Trailer"
                    allowFullScreen
                    />
                </div>

                <div className="player-info">
                    <div className="player-info-image-and-h2">

                        <img 
                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : `https://via.placeholder.com/300x450?text=No+Image`}
                            alt={movie.title || 'Movie poster'}
                            loading="lazy"
                        />

                        <div>
                            <h2>{movie.title}</h2>
                            <p className="genres">
                            {movie.genres?.map(g => g.name).join(", ")}
                            </p>
                        </div>

                        <button 
                            className={`player-favorite-btn ${favorite ? "active" : ""}`} 
                            onClick={onFavoriteClick}
                            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                            aria-pressed={favorite}
                        >
                            ♥
                        </button>
                    </div>
                    

                    <p className="overview">{movie.overview}</p>

                </div>
            </div>


            <button
                onClick={() => navigate(-1)}
                className="back-to-details-btn"
            >
                ⬅ Back
            </button>
        </div>
    );

}

export default MoviePlayer;