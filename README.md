# Movies Website

A React-based movie browsing application that allows users to search for movies and manage their favorites using The Movie Database (TMDb) API.

## Features

- Browse popular movies
- Search for movies
- Add/remove movies from favorites
- Favorites persisted in local storage
- Responsive design

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Get your TMDb API key from [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
5. Add your API key to the `.env` file:
   ```
   VITE_TMDB_API_KEY=your_api_key_here
   ```

## Development

Run the development server:
```bash
npm run dev
```

## Build

Build for production:
```bash
npm run build
```

## Lint

Run ESLint:
```bash
npm run lint
```

## Technologies

- React 19
- Vite with Rolldown
- React Router DOM
- TMDb API
- React Compiler (enabled)
