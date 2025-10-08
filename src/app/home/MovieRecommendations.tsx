"use client";

import { useEffect, useState } from "react";
import { fget } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export default function MovieRecommendations({
  genreIds,
}: {
  genreIds: string;
}) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!genreIds) return;
      try {
        const data = await fget({
          url: `/discover/movie?with_genres=${genreIds}&language=en&page=1`,
          tmdb: true,
        });
        setMovies(data.results);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [genreIds]);

  if (loading) return <div>Loading movies...</div>;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Recommended for you</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {movies.map((movie) => (
          <Link href={`/movie/${movie.id}`} key={movie.id}>
            <div className="cursor-pointer overflow-hidden rounded-lg bg-slate-800 transition-transform hover:scale-105">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="h-auto w-full"
                width={500}
                height={750}
                unoptimized
              />
              <div className="p-2">
                <h3 className="truncate text-sm font-semibold">
                  {movie.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
