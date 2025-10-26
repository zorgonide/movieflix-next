import { NextRequest, NextResponse } from "next/server";
import { AuthenticatedApiHandler } from "./types";
import { getSessionUser } from "./auth";

// Higher-order function to wrap API handlers that require authentication
export function withAuth(handler: AuthenticatedApiHandler) {
  return async (req: NextRequest, context: { params: never }) => {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If the user is authenticated, call the original handler
    // and pass the user object in the context.
    return handler(req, { ...context, user });
  };
}
