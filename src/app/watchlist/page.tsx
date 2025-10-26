import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import WatchlistClient from "./WatchListClient";

export default async function WatchlistPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const watchlistItems = await db.watchList.findMany({
    where: { userId: user.id },
    include: {
      movie: true, // Include the full movie details for each watchlist item
    },
    orderBy: {
      createdAt: "desc", // Show the most recently added movies first
    },
  });
  // Extract just the movie objects to pass to the client
  const movies = watchlistItems.map((item) => item.movie);

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="mb-8 text-3xl font-bold text-white">My Watchlist</h1>
      <WatchlistClient initialMovies={movies} />
    </main>
  );
}
