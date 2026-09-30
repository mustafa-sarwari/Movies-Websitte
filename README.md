# Movie Explorer

A React movie browsing application using TMDB data, client-side routing, and a shared favorites collection. Built as a frontend portfolio project by [Mustafa Sarwari](https://github.com/mustafa-sarwari).

## Features

- Discover movies and search TMDB by title
- Sort discovery results by date, popularity, or rating
- Add and remove favorites stored in browser localStorage
- Navigate between the home, favorites, and movie player pages

## Stack

React, React Router, JavaScript, CSS, and Vite (the package uses rolldown-vite).

## Run locally

```bash
git clone https://github.com/mustafa-sarwari/Movies-Websitte.git
cd Movies-Websitte
npm install
```

Create a local `.env.local` file in the project root:

```dotenv
VITE_TMDB_API_KEY=your_tmdb_api_key
```

```bash
npm run dev
```

Open the URL printed by Vite. The movie API service reads `VITE_TMDB_API_KEY`. Vite variables are included in browser code; use only credentials appropriate for client-side use.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Build into `dist/` |
| `npm run preview` | Preview the build locally |
| `npm run lint` | Run ESLint |

## Code organization

- `src/pages/`: home, favorites, and movie player views
- `src/components/`: movie cards and navigation
- `src/context/MovieContext.jsx`: favorites state and persistence
- `src/services/api.js`: TMDB discovery and search requests
- `src/CSS/`: interface styles

## Scope

This is a frontend project. Favorites belong to the current browser rather than a server account. The movie player view is not a claim of licensed full-movie streaming. Automated test scripts are not currently defined in package.json.
