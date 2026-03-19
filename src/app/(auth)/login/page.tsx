"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gift } from "lucide-react";
import toast from "react-hot-toast";
import DarkModeToggle from "@/components/DarkModeToggle";

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
    <main className="min-h-screen doodle-bg flex items-center justify-center px-4">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-white/10">
        <div className="flex items-center gap-2 justify-center mb-6 font-black text-xl">
          <Gift className="w-6 h-6 text-green-500" />
          <span className="bg-gradient-to-r from-green-500 via-yellow-400 to-pink-500 bg-clip-text text-transparent">
            Kontri
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-center text-gray-900 dark:text-gray-50 mb-1">Welcome back!</h2>
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm mb-6">Log in to your account</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white rounded-xl py-3 font-bold hover:bg-green-400 transition disabled:opacity-60 shadow-lg shadow-green-500/30"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-4">
          New here?{" "}
          <Link href="/register" className="text-green-600 dark:text-green-400 font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
