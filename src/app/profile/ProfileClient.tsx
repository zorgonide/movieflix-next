"use client";

import { useState } from "react";
import { useUser } from "@/components/providers/user-provider";
import { Button } from "@/components/ui/buttons/button";
import { User, Save } from "lucide-react";
import { fpatch } from "@/lib/api";
import GenreSelector from "../home/GenreSelector";

export default function ProfileClient() {
  const { user, setUser } = useUser();
  const [form, setForm] = useState({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Only include password if it's been entered
      const updateData = {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        ...(form.password && { password: form.password }),
      };

      const { user: updatedUser } = await fpatch({
        url: "/api/auth/me",
        data: updateData,
      });

      setUser(updatedUser);
      setSuccess("Profile updated successfully!");
      setForm((prev) => ({ ...prev, password: "" })); // Clear password field
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Profile Details Form */}
      <div className="flex justify-around gap-8 flex-col md:flex-row">
        <div className="rounded-xl bg-slate-900/70 p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <User size={24} className="text-mxpink" />
            <h2 className="text-2xl font-bold">Profile Details</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="New password (leave blank to keep current)"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && <p className="text-sm text-green-400">{success}</p>}
            <Button type="submit" disabled={loading} Icon={Save}>
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </div>
        {/* Genre Preferences */}
        <GenreSelector
          isUpdate={true}
          onSuccess={() => {
            setSuccess("Genres updated successfully!");
          }}
        />
      </div>
    </div>
  );
}
