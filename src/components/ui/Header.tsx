"use client";
import { useState } from "react";
import { useUser } from "@/components/providers/user-provider";
import { LogoutButton } from "./buttons/logoutButton";
import { Menu, X } from "lucide-react";
import CustomLink from "./CustomLink";

const Header = () => {
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  // This component now contains all navigation links
  const NavLinks = () => (
    <>
      {/* Mobile-only Watchlist link */}
      {user && (
        <CustomLink
          href="/watchlist"
          className="w-full rounded p-2 text-left font-mono font-bold text-white md:hidden"
          onClick={closeMenu}
        >
          Watchlist
        </CustomLink>
      )}
      {user ? (
        <div className="flex w-full flex-col items-start gap-3 text-sm md:flex-row md:items-center ">
          <span className="truncate hidden md:block">{user.email}</span>
          <form action="/api/auth/logout" method="POST">
            <LogoutButton />
          </form>
        </div>
      ) : (
        <div className="flex w-full flex-col items-start gap-3 text-sm md:flex-row md:items-center">
          <CustomLink href="/login" onClick={closeMenu}>
            Login
          </CustomLink>
          <CustomLink href="/register" onClick={closeMenu}>
            Register
          </CustomLink>
        </div>
      )}
    </>
  );

  return (
    <header className="relative flex h-16 items-center justify-between bg-mx-light-purple p-4">
      {/* Left side of header */}
      <div className="flex items-center gap-6">
        <CustomLink
          href="/home"
          className="text-2xl font-mono tracking-wide text-white"
        >
          MovieFlix
        </CustomLink>
        {/* Desktop-only Watchlist link */}
        {user && (
          <CustomLink
            href="/watchlist"
            className="hidden rounded p-2 font-mono font-bold text-white transition-colors duration-200 hover:bg-white hover:text-mxpurple md:block"
          >
            Watchlist
          </CustomLink>
        )}
      </div>

      {/* Right side of header (Desktop) */}
      <div className="hidden items-center gap-4 md:flex">
        <NavLinks />
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden align-center flex">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-16 z-20 flex flex-col items-start gap-6 bg-mx-light-purple p-6 shadow-lg md:hidden">
          <NavLinks />
        </div>
      )}
    </header>
  );
};

export default Header;
