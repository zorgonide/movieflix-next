"use client";

import { useEffect, useState } from "react";
import { fget } from "@/lib/api";
import Image from "next/image";
import { Button } from "../../ui/buttons/button";
import { Check, Plus } from "lucide-react";
import { Movie } from "@prisma/client";
// import MovieHeader from "./MovieHeader";
// import CommentSection from "./CommentSection";

export default function MovieDetailClient({ movieId }: { movieId: number }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inWatchlist, setInWatchlist] = useState(false); // Placeholder state

  useEffect(() => {
    const getMovie = async () => {
      try {
        setLoading(true);
        const data = await fget({ url: `/api/movie/${movieId}` });
        setMovie(data);
      } catch (err) {
        setError("Failed to load movie details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getMovie();
  }, [movieId]);

  if (loading) {
    return (
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/* Left Column Skeleton */}
          <div className="col-span-1 flex flex-col items-center md:items-start">
            <div className="w-full max-w-xs animate-pulse rounded-lg bg-slate-800 aspect-[2/3]"></div>
            <div className="mt-4 h-12 w-full max-w-xs animate-pulse rounded-md bg-slate-700"></div>
          </div>

          {/* Right Column Skeleton */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            {/* Movie Header Skeleton */}
            <div className="space-y-4">
              <div className="h-10 w-3/4 animate-pulse rounded-md bg-slate-700"></div>
              <div className="h-6 w-1/4 animate-pulse rounded-md bg-slate-700"></div>
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded-md bg-slate-700"></div>
                <div className="h-4 w-full animate-pulse rounded-md bg-slate-700"></div>
                <div className="h-4 w-5/6 animate-pulse rounded-md bg-slate-700"></div>
              </div>
            </div>

            {/* Comment Section Skeleton */}
            <div className="mt-12">
              <div className="h-8 w-1/3 animate-pulse rounded-md bg-slate-700"></div>
              <div className="mt-6 h-24 w-full animate-pulse rounded-lg bg-slate-800"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  if (!movie) {
    return <div className="text-center">Movie not found.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
      {/* Left Column: Poster and Actions */}
      <div className="col-span-1 flex flex-col items-center md:items-start">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
          alt={movie.title}
          width={500}
          height={750}
          className="w-full max-w-xs rounded-lg object-cover shadow-lg"
          unoptimized
        />
        <Button
          className="mt-4 w-full max-w-xs"
          Icon={inWatchlist ? Check : Plus}
          onClick={() => setInWatchlist(!inWatchlist)} // Placeholder action
        >
          {inWatchlist ? "Added to Watchlist" : "Add to Watchlist"}
        </Button>
      </div>

      {/* Right Column: Movie Details */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        {/* <MovieHeader movie={movie} />
        <CommentSection comments={movie.Comment} movieId={movie.id} /> */}
      </div>
    </div>
  );
}
