import { useEffect, useState } from 'react';
import { searchMovies, getPopularMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import '../CSS/Home.css';
export default function Home() {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('most_viewed');
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true); setError('');
      try { const rows = search ? await searchMovies(search, controller.signal) : await getPopularMovies(page, sort, controller.signal); if (!controller.signal.aborted) setMovies(rows); }
      catch (error) { if (!controller.signal.aborted) { setError(error.message); setMovies([]); } }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }
    load(); return () => controller.abort();
  }, [page, sort, search]);
  return <div className="home">
    <form className="search-form" onSubmit={event => { event.preventDefault(); setSearch(query.trim()); setPage(1); }}>
      <label htmlFor="movie-search" className="sr-only">Search movies</label><input id="movie-search" className="search-input" placeholder="Search movies…" maxLength={200} value={query} onChange={event => setQuery(event.target.value)} />
      <button type="submit" className="search-button">Search</button>
      {search && <button type="button" className="clear-button" onClick={() => { setQuery(''); setSearch(''); setPage(1); }}>Clear</button>}
    </form>
    {!search && <div className="sort-container"><label htmlFor="sort-select">Sort by</label><select id="sort-select" value={sort} onChange={event => { setSort(event.target.value); setPage(1); }}><option value="most_viewed">Most popular</option><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="relevant">Highest rated</option></select></div>}
    {error && <p role="alert">{error}</p>}
    {loading ? <p role="status">Loading movies…</p> : <><div className="movies-grid">{movies.map(movie => <MovieCard movie={movie} key={movie.id} />)}</div>{!movies.length && !error && <p>No movies found.</p>}
      {!search && <div className="pagination"><button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page}</span><button disabled={page >= 500 || movies.length < 20} onClick={() => setPage(page + 1)}>Next</button></div>}
    </>}
  </div>;
}
