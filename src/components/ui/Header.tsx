"use client";
import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/components/providers/user-provider";
import { LogoutButton } from "./buttons/logoutButton";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavContent = () => (
    <>
      {!user && (
        <nav className="flex flex-col md:flex-row items-center gap-4 text-sm">
          <Link
            href="/login"
            className="hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/register"
            className="hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Register
          </Link>
        </nav>
      )}
      {user && (
        <div className="flex w-full flex-col items-start gap-3 text-sm md:flex-row md:items-center">
          <span className="truncate">{user.email}</span>
          <form action="/api/auth/logout" method="POST">
            <LogoutButton />
          </form>
        </div>
      )}
    </>
  );

  return (
    <header className="relative flex justify-between items-center p-4 h-16 bg-mx-light-purple">
      <Link href="/home" className="text-2xl font-bold text-white">
        MovieFlix
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
        <NavContent />
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-mx-light-purple md:hidden flex flex-col items-center gap-6 p-6 shadow-lg z-20">
          <NavContent />
        </div>
      )}
    </header>
  );
};

export default Header;
