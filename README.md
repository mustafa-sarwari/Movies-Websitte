# 🎬 Movies Website

A modern, responsive movie discovery web application built with React and powered by The Movie Database (TMDB) API. Browse popular movies, search for your favorites, watch trailers, and save movies to your favorites list.

![Movie App Screenshot](https://github.com/user-attachments/assets/305877a9-ef24-4ff8-9af4-c63d0c94b4d1)

## ✨ Features

- **Browse Popular Movies** - Discover trending and popular movies with sorting options
- **Search Movies** - Find any movie by title with real-time search
- **Movie Details** - View detailed information about each movie including trailers
- **Watch Trailers** - Embedded YouTube trailers for movies
- **Favorites** - Save your favorite movies locally (persisted in localStorage)
- **Sorting Options** - Sort by Most Viewed, Newest, Oldest, or Highest Rated
- **Pagination** - Browse through thousands of movies with easy pagination
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark Theme** - Modern dark UI for comfortable viewing

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A free [TMDB API Key](https://www.themoviedb.org/settings/api)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mustafa-sarwari/Movies-Websitte.git
   cd Movies-Websitte
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your TMDB API key:
   ```
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```
   
   > 💡 Get your free API key at [TMDB API Settings](https://www.themoviedb.org/settings/api)

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

### Preview Production Build

```bash
npm run preview
```

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/) with Rolldown
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Styling**: CSS3 with responsive design
- **API**: [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api)
- **State Management**: React Context API
- **Data Persistence**: localStorage

## 📁 Project Structure

```
Movies-Websitte/
├── public/              # Static assets
│   └── vite.svg         # Favicon
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── MovieCard.jsx
│   │   └── NavBar.jsx
│   ├── context/         # React Context for state management
│   │   └── MovieContext.jsx
│   ├── CSS/             # Stylesheets
│   │   ├── App.css
│   │   ├── Favorites.css
│   │   ├── Home.css
│   │   ├── MovieCard.css
│   │   ├── MoviePlayer.css
│   │   ├── Navbar.css
│   │   └── index.css
│   ├── pages/           # Page components
│   │   ├── Favorites.jsx
│   │   ├── Home.jsx
│   │   └── MoviePlayer.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── App.jsx          # Main App component
│   └── main.jsx         # Entry point
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore rules
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_TMDB_API_KEY` | Your TMDB API key for fetching movie data | Yes |

### TMDB API

This application uses the TMDB API to fetch:
- Popular movies with various sorting options
- Movie search results
- Movie details and metadata
- Movie trailers from YouTube

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [React](https://react.dev/) for the amazing frontend framework
- [Vite](https://vitejs.dev/) for the blazing fast build tool

---

Made with ❤️ by [Mustafa Sarwari](https://github.com/mustafa-sarwari)
