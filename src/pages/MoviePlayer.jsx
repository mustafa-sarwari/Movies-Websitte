import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMovieContext } from '../context/useMovieContext';
import { movieRequest } from '../services/api';
import '../CSS/MoviePlayer.css';
export default function MoviePlayer() {
  const { id } = useParams();
  const { isFavorite, addToFavorites, removeFromFavorites, ready } = useMovieContext();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setDetails(null); setError('');
      try {
        const [movie, videos] = await Promise.all([movieRequest('/' + id, controller.signal), movieRequest('/' + id + '/videos', controller.signal)]);
        const trailer = videos.results?.find(video => video.type === 'Trailer' && video.site === 'YouTube' && /^[\w-]+$/.test(video.key));
        if (!controller.signal.aborted) setDetails({ movie, trailer: trailer?.key || null });
      } catch (error) { if (!controller.signal.aborted) setError(error.message); }
    }
    load(); return () => controller.abort();
  }, [id]);
  if (error) return <div className="player-page"><p role="alert">{error}</p><Link to="/">Back to movies</Link></div>;
  if (!details) return <p role="status" className="loading">Loading movie details…</p>;
  const { movie, trailer } = details;
  const favorite = isFavorite(movie.id);
  return <div className="player-page"><Link to="/">Back to movies</Link><div className="player-content">
    <div className="player-video">{trailer ? <iframe src={`https://www.youtube.com/embed/${trailer}`} title={`${movie.title} trailer`} allowFullScreen /> : <p>No trailer is available for this movie.</p>}</div>
    <div className="player-info"><h1>{movie.title}</h1><p>{movie.genres?.map(genre => genre.name).join(', ')}</p><p>{movie.overview}</p>
      <button type="button" disabled={!ready} aria-pressed={favorite} onClick={() => favorite ? removeFromFavorites(movie.id) : addToFavorites(movie)}>{favorite ? 'Remove favorite' : 'Add favorite'}</button>
    </div>
  </div></div>;
}
