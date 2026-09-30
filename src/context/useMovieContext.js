import { createContext, useContext } from 'react';
export const MovieContext = createContext(null);
export function useMovieContext() { return useContext(MovieContext); }
