import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { withAuth } from "@/lib/auth-wrapper";

// Get all comments for a movie
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    const comments = await db.comment.findMany({
      where: { movieId: parseInt(movieId) },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
});

// Create a new comment
export const POST = withAuth(async (request: NextRequest) => {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { movieId, comment } = await request.json();

    if (!movieId || !comment) {
      return NextResponse.json(
        { error: "Movie ID and comment are required" },
        { status: 400 }
      );
    }

    if (comment.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment cannot be empty" },
        { status: 400 }
      );
    }

    const newComment = await db.comment.create({
      data: {
        userId: user.id,
        movieId: parseInt(movieId),
        comment: comment.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({ comment: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
});

// Update a comment
export const PATCH = withAuth(async (request: NextRequest) => {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { commentId, comment } = await request.json();

    if (!commentId || !comment) {
      return NextResponse.json(
        { error: "Comment ID and comment text are required" },
        { status: 400 }
      );
    }

    if (comment.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment cannot be empty" },
        { status: 400 }
      );
    }

    // Check if comment belongs to user
    const existingComment = await db.comment.findUnique({
      where: { id_userId: { id: commentId, userId: user.id } },
    });

    if (!existingComment) {
      return NextResponse.json(
        { error: "Comment not found or unauthorized" },
        { status: 404 }
      );
    }

    const updatedComment = await db.comment.update({
      where: { id_userId: { id: commentId, userId: user.id } },
      data: { comment: comment.trim() },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({ comment: updatedComment });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
});

// Delete a comment
export const DELETE = withAuth(async (request: NextRequest) => {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    await db.comment.delete({
      where: {
        id_userId: {
          id: commentId,
          userId: user.id,
        },
      },
    });

    return NextResponse.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
});
