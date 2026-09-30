import { useEffect, useRef, useState } from 'react';
import { MovieContext } from './useMovieContext';
const localMode = location.hostname.endsWith('github.io');
function storedFavorites() {
  try { const rows = JSON.parse(localStorage.getItem('favorites') || '[]'); return Array.isArray(rows) ? rows.filter(row => row && Number.isInteger(row.id)) : []; }
  catch { return []; }
}
async function request(path = '', options = {}) {
  const response = await fetch('/api/favorites' + path, { ...options, headers: { 'Content-Type': 'application/json' } });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'Unable to save favorites.');
  return body;
}
const present = row => ({ ...row, id: row.movieId, recordId: row.id });
export function MovieProvider({ children }) {
  const [favorites, setFavorites] = useState(() => localMode ? storedFavorites() : []);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(localMode);
  const lock = useRef(false);
  useEffect(() => {
    if (localMode) return;
    let active = true;
    request().then(rows => { if (active) { setFavorites(rows.map(present)); setReady(true); } })
      .catch(error => { if (active) setError(error.message); });
    return () => { active = false; };
  }, []);
  async function mutate(action) {
    if (!ready || lock.current) return;
    lock.current = true; setError('');
    try { await action(); } catch (error) { setError(error.message); }
    finally { lock.current = false; }
  }
  function addToFavorites(movie) {
    return mutate(async () => {
      if (!movie || favorites.some(row => row.id === movie.id)) return;
      const row = localMode ? movie : present(await request('', { method: 'POST', body: JSON.stringify({ movieId: movie.id, title: movie.title, poster_path: movie.poster_path, release_date: movie.release_date }) }));
      const next = [...favorites, row]; if (localMode) localStorage.setItem('favorites', JSON.stringify(next)); setFavorites(next);
    });
  }
  function removeFromFavorites(id) {
    return mutate(async () => {
      const row = favorites.find(row => row.id === id); if (!row) return;
      if (!localMode) await request('/' + row.recordId, { method: 'DELETE' });
      const next = favorites.filter(row => row.id !== id); if (localMode) localStorage.setItem('favorites', JSON.stringify(next)); setFavorites(next);
    });
  }
  return <MovieContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, ready, isFavorite: id => favorites.some(row => row.id === id) }}>
    {error && <p role="alert">{error}</p>}{children}
  </MovieContext.Provider>;
}
