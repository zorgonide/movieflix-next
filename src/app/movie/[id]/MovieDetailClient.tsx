"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../../../components/ui/buttons/button";
import { Check, Plus } from "lucide-react";
import { Movie } from "@prisma/client";
import { MovieDescription } from "@/components/ui/movie/MovieDescription";
// import MovieHeader from "./MovieHeader";
// import CommentSection from "./CommentSection";

// The component now receives the movie data as a prop
export default function MovieDetailClient({ movie }: { movie: Movie }) {
  // State is now only for client-side interactions
  const [inWatchlist, setInWatchlist] = useState(false); // Placeholder state

  // No more useEffect, loading, or error states for the initial data!

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
      {/* Left Column: Poster and Actions */}
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
          Icon={inWatchlist ? Check : Plus}
          onClick={() => setInWatchlist(!inWatchlist)} // Placeholder action
        >
          {inWatchlist ? "Added to Watchlist" : "Add to Watchlist"}
        </Button>
      </div>

      {/* Right Column: Movie Details */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <MovieDescription movie={movie} />
        {/* <MovieHeader movie={movie} />
        <CommentSection comments={movie.Comment} movieId={movie.id} /> */}
      </div>
    </div>
  );
}
