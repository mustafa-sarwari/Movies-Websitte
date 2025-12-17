/* import './CSS/App.css'
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import {Routes, Route} from 'react-router-dom';
import { MovieProvider } from './context/MovieContext';
import NavBar from './components/NavBar';


function App() {
  return (
    <MovieProvider>
      <NavBar />
    <main className="main-content">
      <Routes>
        <Route path='/' element= {<Home />} />
        <Route path='/favorites' element={<Favorites />} />
      </Routes>
    </main>
    </MovieProvider>
  );
}


export default App;
 */

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from './pages/Favorites';
import MovieDetails from "./pages/MovieDetails.jsx";
import MoviePlayer from "./pages/MoviePlayer.jsx";
import NavBar from "./components/NavBar.jsx"
import "./CSS/App.css";

function App() {
 return (
  <div>
    <NavBar />

    <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/movie/:id/player" element={<MoviePlayer />} />
    </Routes>
  </div>
 )
}

export default App;