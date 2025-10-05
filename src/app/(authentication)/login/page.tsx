"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/buttons/button";
import { useUser } from "@/components/providers/user-provider";

export default function LoginPage() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user) router.replace("/home");
  }, [user, router]);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      setUser(data.user); // update context
      router.replace("/home"); // client navigation
      router.refresh(); // ensure server state refreshed
    } finally {
      setLoading(false);
    }
  }

  if (user) return null;

  return (
    <main className="max-w-md mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Login</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full rounded p-2 text-black"
          autoComplete="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
        />
        <input
          className="w-full rounded p-2 text-black"
          autoComplete="current-password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          required
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </main>
  );
}
