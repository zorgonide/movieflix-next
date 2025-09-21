import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const SyncUserPage = async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    // This case should ideally not happen as routes are protected
    redirect("/sign-in");
  }

  // Check if the user exists in your database
  const user = await db.user.findUnique({
    where: {
      id: clerkUser.id,
    },
  });

  // If the user doesn't exist, create them
  if (!user) {
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      // Handle case where user has no primary email
      // You might want to show an error page here
      throw new Error("User must have an email address to be synced.");
    }

    await db.user.create({
      data: {
        id: clerkUser.id,
        email: email,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
      },
    });
  }

  // Redirect to the home page after sync is complete
  // This redirect will be caught by the middleware and the user will be
  // directed to the onboarding/genre selection if their genres are empty.
  redirect("/home");

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Syncing your account...</p>
    </div>
  );
};

export default SyncUserPage;
