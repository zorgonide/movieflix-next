import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { genres } = (await request.json()) as { genres: string[] };

    if (!Array.isArray(genres) || genres.length === 0) {
      return new NextResponse("Invalid genres format", { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { genres: genres.join(",") },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = updatedUser;

    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error("Failed to save genres:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { genres } = (await request.json()) as { genres: string[] };

    if (!Array.isArray(genres) || genres.length === 0) {
      return new NextResponse("Invalid genres format", { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { genres: genres.join(",") },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = updatedUser;

    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error("Failed to update genres:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
