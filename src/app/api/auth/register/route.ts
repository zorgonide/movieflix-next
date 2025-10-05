import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();
    if (!email || !password)
      return NextResponse.json(
        { error: "Missing email/password" },
        { status: 400 }
      );

    const existing = await db.user.findUnique({ where: { email } });
    if (existing)
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );

    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: { email, passwordHash, firstName, lastName },
    });

    await createSession(user.id);

    const safeUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      genres: user.genres,
    };

    return NextResponse.json({ user: safeUser });
  } catch (e) {
    console.error("REGISTER_ERROR", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
