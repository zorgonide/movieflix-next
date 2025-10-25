import MovieDetailClient from "@/components/ui/movie/MovieDetailClient";
import { getOrCreateMovie } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const movieId = parseInt(params.id, 10);

  try {
    // Fetch data directly on the server
    const movie = await getOrCreateMovie(movieId);

    // Pass the server-fetched data to the client component as a prop
    return (
      <main className="container mx-auto p-4 md:p-8">
        <MovieDetailClient movie={movie} />
      </main>
    );
  } catch (error) {
    console.error("Failed to load movie page:", error);
    // If the movie doesn't exist in TMDB, show a 404 page
    notFound();
  }
}
