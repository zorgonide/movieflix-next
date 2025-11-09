"use client";
import { useState } from "react";
import { useUser } from "@/components/providers/user-provider";
import { LogoutButton } from "./buttons/logoutButton";
import { Menu, X, User } from "lucide-react";
import CustomLink from "./CustomLink";

const NAV_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/top-movies", label: "Top Movies" },
] as const;

const Header = () => {
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="relative flex h-16 items-center justify-between bg-mx-light-purple p-4">
      {/* Left side - Logo and Desktop Nav */}
      <div className="flex items-center gap-6">
        <CustomLink
          href="/home"
          className="font-mono text-2xl tracking-wide text-white"
        >
          MovieFlix
        </CustomLink>

        {/* Desktop Navigation */}
        {user && (
          <nav className="hidden gap-2 md:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <CustomLink
                key={href}
                href={href}
                className="rounded p-2 font-mono font-bold text-white transition-colors duration-200 hover:bg-white hover:text-mxpurple"
              >
                {label}
              </CustomLink>
            ))}
          </nav>
        )}
      </div>

      {/* Right side - User Menu (Desktop) */}
      {user && (
        <>
          <div className="hidden items-center gap-4 md:flex">
            <CustomLink
              href="/profile"
              className="truncate rounded p-2 font-mono font-bold text-white transition-colors duration-200 hover:bg-white hover:text-mxpurple"
            >
              <User size={16} className="mr-2 inline" />
              {user.firstName}
            </CustomLink>
            <form action="/api/auth/logout" method="POST">
              <LogoutButton />
            </form>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center text-white md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Menu Drawer */}
          {isMenuOpen && (
            <nav className="absolute left-0 right-0 top-16 z-20 flex flex-col items-start gap-2 bg-mx-light-purple p-6 pt-0 shadow-lg md:hidden">
              {NAV_LINKS.slice(1).map(({ href, label }) => (
                <CustomLink
                  key={href}
                  href={href}
                  className="w-full rounded p-2 text-left font-mono font-bold text-white"
                  onClick={closeMenu}
                >
                  {label}
                </CustomLink>
              ))}
              <div className=" flex w-full flex-col items-start gap-3">
                <CustomLink
                  href="/profile"
                  className="w-full truncate rounded p-2 font-mono font-bold text-white"
                  onClick={closeMenu}
                >
                  <User size={16} className="mr-2 inline" />
                  {user.firstName}
                </CustomLink>
                <form
                  action="/api/auth/logout"
                  method="POST"
                  className="w-full"
                >
                  <LogoutButton />
                </form>
              </div>
            </nav>
          )}
        </>
      )}
    </header>
  );
};

export default Header;
