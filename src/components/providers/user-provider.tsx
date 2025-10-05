// ...existing code...
"use client";
import { createContext, useContext, useState } from "react";
import type { SessionUser } from "@/lib/auth";

type UserCtx = {
  user: SessionUser | null;
  setUser: (u: SessionUser | null) => void;
};

const Ctx = createContext<UserCtx | undefined>(undefined);

export function UserProvider({
  user: initialUser,
  children,
}: {
  user: SessionUser | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<SessionUser | null>(initialUser);
  return <Ctx.Provider value={{ user, setUser }}>{children}</Ctx.Provider>;
}

export function useUser() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUser must be inside UserProvider");
  return ctx;
}
