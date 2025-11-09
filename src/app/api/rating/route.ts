import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { withAuth } from "@/lib/auth-wrapper";

export const GET = withAuth(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    // Use Prisma aggregate to calculate average and count
    const aggregateResult = await db.rating.aggregate({
      where: { movieId: parseInt(movieId) },
      _avg: { userRating: true },
      _count: { userRating: true },
    });
    const averageRating = aggregateResult?._avg.userRating || 0;
    const totalRatings = aggregateResult?._count.userRating;

    // Get user's rating if authenticated
    const user = await getSessionUser();
    let userRating = null;

    if (user) {
      const rating = await db.rating.findUnique({
        where: {
          userId_movieId: {
            userId: user.id,
            movieId: parseInt(movieId),
          },
        },
      });
      userRating = rating?.userRating || null;
    }

    return NextResponse.json({
      averageRating: Number(averageRating.toFixed(1)),
      totalRatings,
      userRating,
    });
  } catch (error) {
    console.error("Error fetching rating:", error);
    return NextResponse.json(
      { error: "Failed to fetch rating" },
      { status: 500 }
    );
  }
});

// Create or update a rating
export const POST = withAuth(async (request) => {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { movieId, rating } = await request.json();

    if (!movieId || !rating) {
      return NextResponse.json(
        { error: "Movie ID and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Upsert rating (create or update)
    const newRating = await db.rating.upsert({
      where: {
        userId_movieId: {
          userId: user.id,
          movieId: parseInt(movieId),
        },
      },
      update: {
        userRating: rating,
      },
      create: {
        userId: user.id,
        movieId: parseInt(movieId),
        userRating: rating,
      },
    });

    // Use Prisma aggregate to get updated average and count
    const aggregateResult = await db.rating.aggregate({
      where: { movieId: parseInt(movieId) },
      _avg: { userRating: true },
      _count: { userRating: true },
    });

    const averageRating = aggregateResult?._avg.userRating || 0;
    const totalRatings = aggregateResult?._count.userRating || 0;

    return NextResponse.json({
      rating: newRating,
      averageRating: Number(averageRating.toFixed(1)),
      totalRatings,
    });
  } catch (error) {
    console.error("Error creating rating:", error);
    return NextResponse.json(
      { error: "Failed to create rating" },
      { status: 500 }
    );
  }
});

// Delete a rating
export const DELETE = withAuth(async (request) => {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    await db.rating.delete({
      where: {
        userId_movieId: {
          userId: user.id,
          movieId: parseInt(movieId),
        },
      },
    });

    // Use Prisma aggregate to get updated average and count
    const aggregateResult = await db.rating.aggregate({
      where: { movieId: parseInt(movieId) },
      _avg: { userRating: true },
      _count: { userRating: true },
    });

    const averageRating = aggregateResult?._avg.userRating || 0;
    const totalRatings = aggregateResult?._count.userRating || 0;

    return NextResponse.json({
      message: "Rating deleted",
      averageRating: Number(averageRating.toFixed(1)),
      totalRatings,
    });
  } catch (error) {
    console.error("Error deleting rating:", error);
    return NextResponse.json(
      { error: "Failed to delete rating" },
      { status: 500 }
    );
  }
});
