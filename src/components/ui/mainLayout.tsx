"use client";

import { usePathname } from "next/navigation";
import Header from "./header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noHeaderRoutes = ["/", "/login", "/register"];

  const showHeader = !noHeaderRoutes.includes(pathname);

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
}
