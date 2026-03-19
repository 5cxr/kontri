"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gift } from "lucide-react";
import toast from "react-hot-toast";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error || "Something went wrong");
    } else {
      toast.success("Account created! Please log in.");
      router.push("/login");
    }
  }

  return (
    <main className="min-h-screen bg-amber-50 dark:bg-zinc-900 flex items-center justify-center px-4">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8 w-full max-w-sm border border-gray-100 dark:border-zinc-700">
        <div className="flex items-center gap-2 justify-center mb-6 text-amber-600 font-bold text-xl">
          <Gift className="w-6 h-6" />
          GiftPool
        </div>
        <h2 className="text-2xl font-extrabold text-center text-gray-900 dark:text-gray-50 mb-1">Join the party!</h2>
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm mb-6">Create your GiftPool account</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-300"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="border border-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 text-white rounded-xl py-3 font-bold hover:bg-amber-600 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
