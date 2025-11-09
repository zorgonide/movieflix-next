import MovieDetailClient from "@/app/movie/[id]/MovieDetailClient";
import { getOrCreateMovie } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const movieId = parseInt(await params?.id, 10);

  try {
    // Destructure the movie and the new watchlist status
    const { movie, isUserInWatchlist } = await getOrCreateMovie(movieId);

    return (
      <main className="container mx-auto p-4 md:p-8">
        {/* Pass both as props to the client component */}
        <MovieDetailClient
          movie={movie}
          initialWatchlistStatus={isUserInWatchlist}
        />
      </main>
    );
  } catch (error) {
    console.error("Failed to load movie page:", error);
    notFound();
  }
}
