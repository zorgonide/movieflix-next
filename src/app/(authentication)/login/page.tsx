"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/buttons/button";
import { useUser } from "@/components/providers/user-provider";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useUser();
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
      window.location.href = "/home";
    } finally {
      setLoading(false);
    }
  }

  if (user) return null;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-slate-900/70 p-8 shadow-lg [animation:pop-in_0.3s_ease-out_forwards]">
        <h1 className="text-center text-3xl font-bold">Login</h1>
        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-4 [animation:pop-in_0.3s_ease-out_forwards]">
            <input
              className="w-full rounded-md border-0 bg-white/5 p-3 text-white placeholder:text-gray-400"
              autoComplete="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
            <input
              className="w-full rounded-md border-0 bg-white/5 p-3 text-white placeholder:text-gray-400"
              autoComplete="current-password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              required
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={loading} Icon={LogIn}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Don&#39;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-mxpink hover:text-mxpink-hover"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
