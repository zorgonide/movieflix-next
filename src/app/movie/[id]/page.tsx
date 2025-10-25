import MovieDetailClient from "@/components/ui/movie/MovieDetailClient";

export default function MoviePage({ params }: { params: { id: string } }) {
  const movieId = parseInt(params.id, 10);

  // We pass the ID to a client component which will handle all data fetching and state.
  return (
    <main className="container mx-auto p-4 md:p-8">
      <MovieDetailClient movieId={movieId} />
    </main>
  );
}
