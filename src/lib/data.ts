import { db } from "./db";
import { fget } from "./api";
import { tmdbMovie } from "./types";
import { getSessionUser } from "./auth"; // Import session helper

export async function getOrCreateMovie(movieId: number) {
  const user = await getSessionUser(); // Get the current user on the server

  // 1. Try to find the movie in your local database
  const movie = await db.movie.findUnique({
    where: { id: movieId },
    include: {
      Comment: { include: { user: true } },
      Rating: true,
      WatchList: true, // We only need the userId, so no need for nested include
    },
  });

  // 2. If found, calculate watchlist status and return both
  if (movie) {
    const isUserInWatchlist = user
      ? movie.WatchList.some((item) => item.userId === user.id)
      : false;
    return { movie, isUserInWatchlist };
  }

  // 3. If not found, fetch from TMDB
  const tmdbMovieData: tmdbMovie = await fget({
    url: `/movie/${movieId}?append_to_response=credits`,
    tmdb: true,
  });

  if (!tmdbMovieData || !tmdbMovieData.id) {
    throw new Error("Movie not found on TMDB");
  }

  // 4. Create the movie in your DB
  const newMovie = await db.movie.create({
    data: {
      id: tmdbMovieData.id,
      title: tmdbMovieData.title,
      description: tmdbMovieData.overview,
      poster: tmdbMovieData.poster_path,
      background: tmdbMovieData.backdrop_path || "",
      year: tmdbMovieData.release_date?.slice(0, 4) || "",
      imdbRating: tmdbMovieData.vote_average,
    },
    include: {
      Comment: true,
      Rating: true,
      WatchList: true,
    },
  });

  // For a new movie, the user is definitely not in the watchlist yet.
  return { movie: newMovie, isUserInWatchlist: false };
}
