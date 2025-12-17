import { useParams, Link } from "react-router-dom";

function MoviePlayer(){

    const { id } = useParams();
    
    return (
        <div style={{ padding: "20px", color: "white"}} >

            <h1>Playing Movie ID: {id}</h1>

            <video width="900" controls style={{ borderRadius: "10px", marginTop: "20px"}}>
                <source src="/videos/sample.mp4" type="video/mp4" />
                Your browser does not support video playback.

            </video>

            <br />

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