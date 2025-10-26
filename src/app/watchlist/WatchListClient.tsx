"use client";

import { useState } from "react";
import { Movie } from "@prisma/client";
import MoviePoster from "@/components/ui/movie/MoviePoster";
import { fdelete } from "@/lib/api";
import { X } from "lucide-react";

export default function WatchlistClient({
  initialMovies,
}: {
  initialMovies: Movie[];
}) {
  const [movies, setMovies] = useState(initialMovies);

  const handleRemove = async (movieId: number) => {
    const originalMovies = movies;
    setMovies((currentMovies) =>
      currentMovies.filter((movie) => movie.id !== movieId)
    );
    try {
      // Send the request to the server
      await fdelete({ url: `/api/watchlist?movieId=${movieId}` });
    } catch (error) {
      console.error("Failed to remove movie from watchlist:", error);
      // If the API call fails, revert the UI to its original state
      setMovies(originalMovies);
      alert("Failed to remove movie. Please try again.");
    }
    // Optimistic UI update: remove the movie from the state immediately
  };

  if (movies.length === 0) {
    return (
      <div className="text-center text-gray-400">
        <p>Your watchlist is empty.</p>
        <p>Add movies from their detail pages to see them here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <div key={movie.id} className="group relative">
          <MoviePoster movie={movie} />
          <button
            onClick={() => handleRemove(movie.id)}
            className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-all duration-200 group-hover:opacity-100 hover:!opacity-100 hover:bg-mxpink"
            aria-label="Remove from watchlist"
          >
            <X size={20} />
          </button>
        </div>
      ))}
    </div>
  );
}
