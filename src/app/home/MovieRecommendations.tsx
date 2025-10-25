"use client";

import { useEffect, useState } from "react";
import { fget } from "@/lib/api";
import { tmdbMovie } from "@/lib/types";
import { Button } from "@/components/ui/buttons/button";
import { Loader2 } from "lucide-react";
import MoviePoster from "@/components/ui/MoviePoster";

export default function MovieRecommendations({
  genreIds,
}: {
  genreIds: string;
}) {
  const [movies, setMovies] = useState<tmdbMovie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchMovies = async (pageNum: number) => {
      if (!genreIds) return;
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setMoreLoading(true);
      }

      try {
        const data = await fget({
          url: `/discover/movie?with_genres=${genreIds}&language=en&page=${pageNum}`,
          tmdb: true,
        });

        setMovies((prev) =>
          pageNum === 1 ? data.results : [...prev, ...data.results]
        );
        setHasMore(data.page < data.total_pages);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
        setMoreLoading(false);
      }
    };

    fetchMovies(page);
  }, [genreIds, page]);

  const handleLoadMore = () => {
    if (!moreLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (loading) return <div>Loading movies...</div>;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Recommended for you</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {movies.map((movie) => (
          <MoviePoster key={movie.id} movie={movie} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={moreLoading}
            Icon={moreLoading ? Loader2 : undefined}
            fullWidth={false}
          >
            {moreLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
