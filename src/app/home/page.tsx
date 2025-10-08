"use client";

import { useUser } from "@/components/providers/user-provider";
import { useEffect, useState } from "react";
import { fget, fpost } from "@/lib/api";
import { ListPlus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/buttons/button";

// Define types for better type safety
interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

// Component for Genre Selection
function GenreSelector() {
  const { setUser } = useUser();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch genres from TMDB API
    const fetchGenres = async () => {
      try {
        const data = await fget({
          url: `/genre/movie/list?language=en`,
          tmdb: true,
        });
        setGenres(data.genres);
      } catch (err) {
        setError("Could not fetch genres. Please try again later.");
        console.error(err);
      }
    };

    fetchGenres();
  }, []);

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleSave = async () => {
    if (selectedGenres.length < 2) {
      setError("Please select at least 2 genres.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Use fpost to save genres to your backend
      const { user: updatedUser } = await fpost({
        url: "/api/auth/user/genres",
        data: { genres: selectedGenres },
      });
      setUser(updatedUser); // Update user context to trigger re-render
    } catch (err: any) {
      setError(err.message || "Failed to save genres.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">Welcome!</h1>
      <p className="mt-2 text-lg text-gray-300">
        Select at least 2 of your favorite genres to get movie recommendations.
      </p>
      <div className="my-8 flex flex-wrap justify-center gap-3">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => toggleGenre(genre.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
              selectedGenres.includes(genre.id)
                ? "bg-mxpink text-white"
                : "bg-slate-700 text-gray-200 hover:bg-slate-600"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <Button
        onClick={handleSave}
        disabled={loading || selectedGenres.length < 2}
        Icon={ListPlus}
        fullWidth={false}
      >
        {loading ? "Saving..." : "Save Genres"}
      </Button>
    </div>
  );
}

// Placeholder for showing recommended movies
function MovieRecommendations() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await fget({
          url: `/movie/popular?language=en&page=1`,
          tmdb: true,
        });
        setMovies(data.results);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) return <div>Loading movies...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Recommended for you</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="cursor-pointer overflow-hidden rounded-lg bg-slate-800 transition-transform hover:scale-105"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto"
              width={500}
              height={750}
            />
            <div className="p-2">
              <h3 className="truncate text-sm font-semibold">{movie.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user } = useUser();

  // Check if user object exists and if the genres property is a non-empty string
  const hasGenres = user && user.genres && user.genres !== "[]";
  console.log("User genres:", user?.genres);
  return (
    <main className="container mx-auto p-8">
      {user ? (
        hasGenres ? (
          <MovieRecommendations />
        ) : (
          <GenreSelector />
        )
      ) : (
        <div className="font-mono">{`bye bye :)`}</div>
      )}
    </main>
  );
}
