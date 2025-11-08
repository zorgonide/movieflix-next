import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="mb-8 text-3xl font-bold text-white">My Profile</h1>
      <ProfileClient />
    </main>
  );
}
