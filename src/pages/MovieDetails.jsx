import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`)
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, [id]);

  if (!movie) return <h2>Loading...</h2>;

  return (
    <div style={{ display: "block", margin: "auto", padding: "20px", color: "white", textAlign:"center  " }}>
      <h1>{movie.title}</h1>

      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        style={{ width: "400px", borderRadius: "10px",  paddingTop: "20px"}}
      />

      <h2 style={{ marginTop: "20px" }}>Descrition</h2>

      <p style={{ maxWidth: "600px" , textAlign: "justify",display: "block", margin: "auto"}}> {movie.overview}</p>

      <Link
        to={`/movie/${id}/player`}
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "12px 20px",
          background: "#ff4c4c",
          color: "#fff",
          borderRadius: "10px",
          textDecoration: "none",
          fontSize: "18px",
        }}
      >
        ▶ Play Movie
      </Link>
    </div>
  );
}

export default MovieDetails;
