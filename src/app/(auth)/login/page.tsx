"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gift } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Welcome back!");
      router.push("/dashboard");
    }
  }

  return (
    <main className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-6 text-amber-600 font-bold text-xl">
          <Gift className="w-6 h-6" />
          GiftPool
        </div>
        <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-1">Welcome back!</h2>
        <p className="text-center text-gray-400 text-sm mb-6">Log in to your account</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 text-white rounded-xl py-3 font-bold hover:bg-amber-600 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-4">
          New here?{" "}
          <Link href="/register" className="text-amber-600 font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
