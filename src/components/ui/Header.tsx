"use client";
import { useState } from "react";
import { useUser } from "@/components/providers/user-provider";
import { LogoutButton } from "./buttons/logoutButton";
import { Menu, X } from "lucide-react";
import CustomLink from "./CustomLink";

const Header = () => {
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavContent = () => (
    <>
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
      <CustomLink
        href="/home"
        className="text-2xl font-mono tracking-wide text-white"
      >
        MovieFlix
      </CustomLink>

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
