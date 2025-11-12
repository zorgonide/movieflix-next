import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a singleton instance with better error handling
export const db =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    errorFormat: "pretty",
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}

// Graceful shutdown
if (typeof window === "undefined") {
  process.on("beforeExit", async () => {
    await db.$disconnect();
  });
}
