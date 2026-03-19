"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gift, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function CreateRoomPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, targetAmount, deadline }),
    });
    setLoading(false);
    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error || "Failed to create room");
    } else {
      const room = await res.json();
      toast.success("Room created! Share the invite link.");
      router.push(`/room/${room.id}`);
    }
  }

  return (
    <main className="min-h-screen doodle-bg">
      <nav className="flex items-center justify-between px-8 py-4 bg-white/90 dark:bg-slate-950/80 backdrop-blur-sm border-b border-gray-200/80 dark:border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2 font-black text-xl">
          <Gift className="w-6 h-6 text-green-500 dark:text-green-400" />
          <span className="bg-gradient-to-r from-green-500 via-yellow-400 to-pink-500 dark:from-green-400 dark:via-yellow-300 dark:to-pink-400 bg-clip-text text-transparent">
            Kontri
          </span>
        </Link>
        <DarkModeToggle />
      </nav>

      <div className="max-w-lg mx-auto px-6 py-10">
        <Link href="/dashboard" className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">Start a gift mission</h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm mb-8">Fill in the details and share the link with your group.</p>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col gap-4 border border-gray-200 dark:border-white/10">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Gift title</label>
            <input
              type="text"
              placeholder="e.g. Rohan's Birthday Gift"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description (optional)</label>
            <textarea
              placeholder="What's the gift? Any message for the group?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-400 resize-none text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Target amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
              min={1}
              className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="w-full border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white rounded-xl py-3 font-bold hover:bg-green-600 transition disabled:opacity-60 mt-2"
          >
            {loading ? "Creating..." : "Create room"}
          </button>
        </form>
      </div>
    </main>
  );
}
