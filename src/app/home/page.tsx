"use client";

import { useUser } from "@/components/providers/user-provider";
import { useEffect } from "react";

export default function HomePage() {
  const { user } = useUser();

  useEffect(() => {
    console.log("DB user (from context):", user);
  }, [user]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Home</h1>
      <pre className="mt-4 text-sm bg-black/20 p-4 rounded">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
