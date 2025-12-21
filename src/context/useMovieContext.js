import { createContext, useContext } from "react";

export const MovieContext = createContext();

export const useMovieContext = () => {
    const context = useContext(MovieContext);
    if (context === undefined) {
        throw new Error("useMovieContext must be used within a MovieProvider");
    }
    return context;
};
