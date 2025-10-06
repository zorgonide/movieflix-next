// no filepath (decide placement)
"use client";
import { useTransition } from "react";
import { useUser } from "@/components/providers/user-provider";
import { Button } from "./button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const { setUser } = useUser();
  const [pending, start] = useTransition();

  return (
    <Button
      disabled={pending}
      Icon={LogOut}
      onClick={() =>
        start(async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          setUser(null); // clear context immediately
          window.location.href = "/login"; // ensure server state refreshed
        })
      }
    >
      {pending ? "Logging out..." : "Logout"}
    </Button>
  );
}
