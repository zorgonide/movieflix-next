import { Inter } from "next/font/google"; // 1. Import the font
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import { UserProvider } from "@/components/providers/user-provider";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { User2 } from "lucide-react";
const inter = Inter({ subsets: ["latin"] });
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkUser = await currentUser();
  let dbUser = null;

  // If a Clerk user exists, fetch the corresponding user from your database
  if (clerkUser) {
    dbUser = await db.user.findUnique({ where: { id: clerkUser.id } });
  }
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-mxpurple text-white`}>
          <UserProvider user={dbUser}>
            <header className="flex justify-end items-center p-4 gap-4 h-16 bg-mx-light-purple">
              <SignedOut>
                <SignInButton />
                <SignUpButton>
                  <Button href="/home" Icon={User2}>
                    Sign up
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            {children}
          </UserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
