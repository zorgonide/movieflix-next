import { db } from "./db";
import { fget } from "./api";
import { tmdbMovie } from "./types";

export async function getOrCreateMovie(movieId: number) {
  // 1. Try to find the movie in your local database
  const movie = await db.movie.findUnique({
    where: { id: movieId },
    include: {
      Comment: { include: { user: true } },
      Rating: true,
    },
  });

  // 2. If found, return it
  if (movie) {
    return movie;
  }

  // 3. If not found, fetch from TMDB
  const tmdbMovie: tmdbMovie = await fget({
    url: `/movie/${movieId}`,
    tmdb: true,
  });

  if (!tmdbMovie || !tmdbMovie.id) {
    throw new Error("Movie not found on TMDB");
  }

  // 4. Create it in your DB using upsert for safety and return the new record
  return db.movie.upsert({
    where: { id: movieId },
    update: {}, // No update needed if found concurrently
    create: {
      id: tmdbMovie.id,
      title: tmdbMovie.title,
      description: tmdbMovie.overview,
      poster: tmdbMovie.poster_path,
      background: tmdbMovie.backdrop_path,
      year: tmdbMovie.release_date?.slice(0, 4) || "",
      imdbRating: tmdbMovie.vote_average,
    },
    include: {
      Comment: { include: { user: true } },
      Rating: true,
    },
  });
}
