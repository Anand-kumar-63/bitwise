"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!data.success) {
        toast.error("Invalid password");
        return;
      }

      const from = searchParams.get("from") || "/admin";
      router.push(from);
      router.refresh();
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0806] flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-[#c9a84c]/15 bg-[#110e0a] p-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl text-[#c9a84c] mb-2">Taania Admin</h1>
          <p className="text-sm text-[#8a7d6e]">
            Sign in to manage products and offers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="text-[0.65rem] uppercase tracking-[0.15em] text-[#6b6258] block mb-2"
            >
              Admin Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0a0806] border border-[#c9a84c]/20 text-[#f0e8dc] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c]/50"
              placeholder="Enter admin password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#c9a84c] text-[#0a0806] py-3 text-[0.75rem] font-semibold tracking-[0.12em] uppercase hover:bg-[#e8c96a] transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Sign In"}
          </button>
        </form>

        <p className="text-[0.68rem] text-[#6b6258] mt-6 text-center leading-relaxed">
          Demo default password is <span className="text-[#c9a84c]">admin123</span>.
          Set <code className="text-[#8a7d6e]">ADMIN_PASSWORD</code> in env to change it.
        </p>
      </div>
    </div>
  );
}
