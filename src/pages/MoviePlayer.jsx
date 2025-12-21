import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../CSS/MoviePlayer.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";


function MoviePlayer(){

    const { id } = useParams();
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

    if(!trailerKey || !movie) return <p className="loading" >Loadding...</p>;

    return (
        <div className="player-page">

            <div className="player-top">
                <Link
                to={`/movie/${id}`} className="close-btn">✕</Link>
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
                            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                            alt={movie.title}
                        />

                        <div>
                            <h2>{movie.title}</h2>
                            <p className="genres">
                            {movie.genres?.map(g => g.name).join(", ")}
                            </p>
                        </div>
                    </div>
                    

                    <p className="overview">{movie.overview}</p>

                </div>
            </div>


            <Link
            to={`/movie/${id}`}
            style={{
                display: "inline-block",
                marginTop: "20px",
                padding: "12px 20px",
                background: "gray",
                color: "white",
                borderRadius: "10px",
                textDecoration: "none",
            }}
            >⬅ Back to Details</Link>
        </div>
    );

}

export default MoviePlayer;