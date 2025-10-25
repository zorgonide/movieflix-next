import { fget } from "@/lib/api";
import { db } from "@/lib/db";
import { tmdbMovie } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movieId = parseInt(params.id, 10);
    if (isNaN(movieId)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }

    // First, try to find the movie. If it exists, we'll get it with its relations.
    let movie = await db.movie.findUnique({
      where: { id: movieId },
      include: {
        Comment: { include: { user: true } },
        Rating: true,
      },
    });

    // If the movie is not found in our DB, we fetch it from TMDB and upsert it.
    if (!movie) {
      const tmdbMovie: tmdbMovie = await fget({
        url: `/movie/${movieId}?append_to_response=credits`,
        tmdb: true,
      });

      if (!tmdbMovie || !tmdbMovie.id) {
        return NextResponse.json({ error: "Movie not found" }, { status: 404 });
      }

      // Use upsert to atomically create the movie if it doesn't exist.
      // This is safer than a separate find and create.
      movie = await db.movie.upsert({
        where: { id: movieId },
        // We don't want to update anything if it's found at this stage.
        update: {},
        // Create the movie with the data fetched from TMDB.
        create: {
          id: tmdbMovie.id,
          title: tmdbMovie.title,
          description: tmdbMovie.overview,
          poster: tmdbMovie.poster_path,
          background: tmdbMovie.backdrop_path,
          year: tmdbMovie.release_date?.slice(0, 4) || "",
          imdbRating: tmdbMovie.vote_average,
        },
        // Include the (empty) relations for the newly created movie.
        include: {
          Comment: { include: { user: true } },
          Rating: true,
        },
      });
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error("Failed to get or create movie:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
