import MovieDetailClient from "@/app/movie/[id]/MovieDetailClient";
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

    return (
      <main className="container mx-auto p-4 md:p-8">
        <MovieDetailClient movie={movie} />
      </main>
    );
  } catch (error) {
    console.error("Failed to load movie page:", error);
    notFound();
  }
}
