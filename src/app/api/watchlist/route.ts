import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-wrapper";

export const GET = withAuth(async (_req, { user }) => {
  try {
    const movies = await db.watchList.findMany({
      where: { userId: user.id },
      include: { movie: true },
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

export const POST = withAuth(async (req, { user }) => {
  const { movieId } = await req.json();
  try {
    const watchlistItem = await db.watchList.create({
      data: {
        userId: user.id,
        movieId: movieId,
      },
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
  // Read the movieId from the URL search parameters
  const { searchParams } = new URL(req.url);
  const movieIdParam = await searchParams.get("movieId");
  console.log("Received DELETE request for movieId:", movieIdParam);
  if (!movieIdParam) {
    return NextResponse.json(
      { error: "Movie ID is required" },
      { status: 400 }
    );
  }

  const movieId = parseInt(movieIdParam, 10);
  console.log("Deleting movieId:", movieId, "for userId:", user.id);
  try {
    await db.watchList.deleteMany({
      where: {
        userId: user.id,
        movieId: movieId,
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
