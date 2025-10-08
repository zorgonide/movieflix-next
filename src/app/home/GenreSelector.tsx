"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/components/providers/user-provider";
import { fget, fpost } from "@/lib/api";
import { Button } from "@/components/ui/buttons/button";
import { ListPlus } from "lucide-react";

interface Genre {
  id: number;
  name: string;
}

export default function GenreSelector() {
  const { setUser } = useUser();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      const { user: updatedUser } = await fpost({
        url: "/api/auth/user/genres",
        data: { genres: selectedGenres },
      });
      setUser(updatedUser);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to save genres.");
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
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
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
