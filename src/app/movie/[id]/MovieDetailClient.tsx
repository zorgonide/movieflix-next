"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../../../components/ui/buttons/button";
import { Check, Loader2, Plus } from "lucide-react";
import { Movie } from "@/lib/types";
import { MovieDescription } from "@/components/ui/movie/MovieDescription";
import { useUser } from "@/components/providers/user-provider";
import { fpost, fdelete } from "@/lib/api";

export default function MovieDetailClient({
  movie,
  initialWatchlistStatus,
}: {
  movie: Movie;
  initialWatchlistStatus: boolean;
}) {
  const { user } = useUser();

  // The initial state is now directly provided by the server!
  const [inWatchlist, setInWatchlist] = useState(initialWatchlistStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleWatchlist = async () => {
    if (!user) {
      alert("Please log in to add movies to your watchlist.");
      return;
    }

    setIsSubmitting(true);
    const wasInWatchlist = inWatchlist;
    setInWatchlist(!wasInWatchlist); // Optimistic update

    try {
      if (wasInWatchlist) {
        await fdelete({ url: `/api/watchlist?movieId=${movie.id}` });
      } else {
        await fpost({ url: "/api/watchlist", data: { movieId: movie.id } });
      }
    } catch (error) {
      console.error("Failed to update watchlist:", error);
      setInWatchlist(wasInWatchlist); // Revert on error
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
      <div className="col-span-1 flex flex-col items-center md:items-start">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
          alt={movie.title}
          width={500}
          height={750}
          className="w-full max-w-xs rounded-sm object-cover shadow-lg"
        />
        <Button
          className="mt-4 w-full max-w-xs"
          Icon={isSubmitting ? Loader2 : inWatchlist ? Check : Plus}
          onClick={handleToggleWatchlist}
          disabled={isSubmitting}
        >
          {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
        </Button>
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <MovieDescription movie={movie} />
      </div>
    </div>
  );
}
