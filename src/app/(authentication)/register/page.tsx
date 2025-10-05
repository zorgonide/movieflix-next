"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/providers/user-provider";

export default function RegisterPage() {
  const { user } = useUser();
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Registration failed");
      return;
    }
    router.replace("/home");
    router.refresh();
  }
  useEffect(() => {
    if (user) router.replace("/home");
  }, [user, router]);
  if (user) return null;
  else
    return (
      <main className="max-w-md mx-auto p-8 space-y-6">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full rounded p-2 text-black"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <div className="flex gap-2">
            <input
              className="w-1/2 rounded p-2 text-black"
              placeholder="First name"
              value={form.firstName}
              onChange={(e) =>
                setForm((f) => ({ ...f, firstName: e.target.value }))
              }
            />
            <input
              className="w-1/2 rounded p-2 text-black"
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) =>
                setForm((f) => ({ ...f, lastName: e.target.value }))
              }
            />
          </div>
          <input
            className="w-full rounded p-2 text-black"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            type="submit"
          >
            Register
          </button>
        </form>
      </main>
    );
}
