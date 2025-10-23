"use client";

import { useUser } from "@/components/providers/user-provider";
import GenreSelector from "./GenreSelector";
import MovieRecommendations from "./MovieRecommendations";

export default function HomePage() {
  const { user } = useUser();

  // Correctly check if the genres string is present and not the empty array "[]"
  const hasGenres = user && user.genres && user.genres !== "[]";

  return (
    <main className="container min-h-dvh mx-auto p-8">
      {!user ? (
        <div className="text-center font-mono">Loading profile...</div>
      ) : hasGenres ? (
        <MovieRecommendations genreIds={user.genres} />
      ) : (
        <GenreSelector />
      )}
    </main>
  );
}
