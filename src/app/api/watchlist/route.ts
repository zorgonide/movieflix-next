import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-wrapper";

export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get("movieId");

    if (movieId) {
      // Check if a specific movie is in the watchlist
      const watchlistItem = await db.watchList.findUnique({
        where: {
          userId_movieId: {
            userId: user.id,
            movieId: parseInt(movieId),
          },
        },
      });

      return NextResponse.json({
        inWatchlist: !!watchlistItem,
      });
    }

    // Get all watchlist items for the user
    const movies = await db.watchList.findMany({
      where: { userId: user.id },
      include: { movie: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ movies });
  } catch (error) {
    console.error("Failed to fetch watchlist movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist movies" },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (req: NextRequest, { user }) => {
  try {
    const { movieId } = await req.json();

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    // Check if already in watchlist to prevent duplicates
    const existing = await db.watchList.findUnique({
      where: {
        userId_movieId: {
          userId: user.id,
          movieId: parseInt(movieId),
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Movie already in watchlist" },
        { status: 400 }
      );
    }

    const watchlistItem = await db.watchList.create({
      data: {
        userId: user.id,
        movieId: parseInt(movieId),
      },
      include: { movie: true },
    });

    return NextResponse.json({ watchlistItem });
  } catch (error) {
    console.error("Failed to add movie to watchlist:", error);
    return NextResponse.json(
      { error: "Failed to add movie to watchlist" },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (req: NextRequest, { user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const movieIdParam = searchParams.get("movieId");

    if (!movieIdParam) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    const movieId = parseInt(movieIdParam, 10);

    // Use delete with composite key instead of deleteMany
    await db.watchList.delete({
      where: {
        userId_movieId: {
          userId: user.id,
          movieId: movieId,
        },
      },
    });

    return NextResponse.json({
      message: "Successfully removed from watchlist",
    });
  } catch (error) {
    console.error("Failed to remove movie from watchlist:", error);
    return NextResponse.json(
      { error: "Failed to remove movie from watchlist" },
      { status: 500 }
    );
  }
});
