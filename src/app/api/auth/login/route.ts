import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );

    const user = await db.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json({ error: "Invalid login" }, { status: 401 });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok)
      return NextResponse.json({ error: "Invalid login" }, { status: 401 });

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
    console.error("LOGIN_ERROR", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
