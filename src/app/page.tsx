import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="mb-8">
        <h1 className="text-7xl font-extrabold tracking-tight">MovieFlix</h1>
        <p className="mt-2 text-lg text-mxpink">
          Your universe of movies. Discover, rate, and discuss.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="font-semibold">Ready to dive in?</p>
        <Button href="/home" Icon={Film}>
          Get Started
        </Button>
      </div>
    </main>
  );
}
