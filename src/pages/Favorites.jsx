import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import '../CSS/Favorites.css';

function Favorites() {
    const {favorites} = useMovieContext();

    if(favorites.length > 0) {
        const count = favorites.length;
        const gridClass = count === 1
            ? 'grid-single'
            : count === 2
            ? 'grid-two'
            : count === 3
            ? 'grid-three'
            : 'grid-many';
        return (
        <div className="favorites">
            <h2>Your Favorites</h2>
        <div className={`movies-grid ${gridClass}`}>
            {favorites.map( movie => (<MovieCard movie={movie} key={movie.id}/>
        ))}
        </div>
        </div>
        )
    };
return (
    <div className="favorites-empty">
        <h2>No Favorite Movies Yet</h2>
        <p>Start adding movies to your favorites and they will appear here!</p>
    </div>
)
}

export default Favorites;