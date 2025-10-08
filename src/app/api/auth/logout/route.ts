import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST(req: Request) {
  await destroySession();

  // Get the origin from the incoming request URL
  const requestUrl = new URL(req.url);
  const origin = requestUrl.origin;

  // Construct the redirect URL using the dynamic origin
  const loginUrl = new URL("/login", origin);

  return NextResponse.redirect(loginUrl);
}
