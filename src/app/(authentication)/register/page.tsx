"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/buttons/button";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      // On successful registration, redirect to login
      router.push("/login");
    } catch (e) {
      setError("An unexpected error occurred." + e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-slate-900/70 p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold">Create Account</h1>
        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-4">
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
            <div className="flex gap-4">
              <input
                className="w-full rounded-md border-0 bg-white/5 p-3 text-white placeholder:text-gray-400"
                autoComplete="given-name"
                type="text"
                placeholder="First name"
                value={form.firstName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstName: e.target.value }))
                }
                required
              />
              <input
                className="w-full rounded-md border-0 bg-white/5 p-3 text-white placeholder:text-gray-400"
                autoComplete="family-name"
                type="text"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lastName: e.target.value }))
                }
                required
              />
            </div>
            <input
              className="w-full rounded-md border-0 bg-white/5 p-3 text-white placeholder:text-gray-400"
              autoComplete="new-password"
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
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-mxpink hover:text-mxpink-hover"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
