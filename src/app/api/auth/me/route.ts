import { NextResponse } from "next/server";
import { getSessionUser, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email, password, firstName, lastName } = await request.json();

  const newUser: {
    email?: string;
    passwordHash?: string;
    firstName?: string;
    lastName?: string;
  } = {};

  if (firstName) newUser.firstName = firstName;
  if (lastName) newUser.lastName = lastName;
  if (email) newUser.email = email;
  if (password) newUser.passwordHash = await hashPassword(password);

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: newUser,
  });

  const safeUser = {
    id: updatedUser.id,
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    role: updatedUser.role,
    genres: updatedUser.genres,
  };

  return NextResponse.json({ user: safeUser });
}
