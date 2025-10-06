// ...existing code...
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/components/providers/user-provider";
import { getSessionUser } from "@/lib/auth";
import { Analytics } from "@vercel/analytics/next";
import MainLayout from "@/components/ui/mainLayout";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-mxpurple text-white`}>
        <UserProvider user={user}>
          <MainLayout>{children}</MainLayout>
          <Analytics />
        </UserProvider>
      </body>
    </html>
  );
}
