import './Favorites.css'

function Favorites() {
  return (
    <div className="favorites-container">
      <h2 className="favorites-title">My Favorite Movies</h2>
      <div className="favorites-list">
        <div className="favorite-item">
          <div className="favorite-card">
            <h3>Movie Title 1</h3>
            <p>This is a sample favorite movie</p>
          </div>
        </div>
        <div className="favorite-item">
          <div className="favorite-card">
            <h3>Movie Title 2</h3>
            <p>Another favorite movie</p>
          </div>
        </div>
        <div className="favorite-item">
          <div className="favorite-card">
            <h3>Movie Title 3</h3>
            <p>Yet another favorite</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Favorites
