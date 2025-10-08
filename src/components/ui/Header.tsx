"use client";
import Link from "next/link";
import { useUser } from "@/components/providers/user-provider";
import { LogoutButton } from "./buttons/logoutButton";

const Header = () => {
  const { user } = useUser();
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16 bg-mx-light-purple">
      {!user && (
        <nav className="flex gap-4 text-sm">
          <Link href="/login" className="hover:underline">
            Login
          </Link>
          <Link href="/register" className="hover:underline">
            Register
          </Link>
        </nav>
      )}
      {user && (
        <form
          action="/api/auth/logout"
          method="POST"
          className="flex gap-3 items-center text-sm"
        >
          <span>{user.email}</span>
          <LogoutButton />
        </form>
      )}
    </header>
  );
};

export default Header;
