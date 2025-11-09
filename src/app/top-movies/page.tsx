import MovieRecommendations from "../../components/ui/MovieRecommendations";

export default function Page() {
  return (
    <main className="container min-h-dvh mx-auto p-8">
      <MovieRecommendations topmovies={true} />
    </main>
  );
}
