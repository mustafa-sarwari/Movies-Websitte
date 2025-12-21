import "../CSS/Navbar.css";
import  {Link, useLocation} from 'react-router-dom';
function NavBar(){
    const location = useLocation();
    const isMoviePlayerPage = location.pathname.includes('/movie/');
    
    return <nav className={`navbar ${isMoviePlayerPage ? 'navbar-constrained' : ''}`}>
            <div>
                <div className="navbar-brand">
                    <Link to="/" > Movie App</Link>
                </div>

                <div className="navbar-links">
                    <Link to = "/" className="nav-link">Home</Link>
                    <Link to = "/favorites" className="nav-link">Favorites</Link>
                </div>
            </div>
        </nav>
}

export default NavBar;
