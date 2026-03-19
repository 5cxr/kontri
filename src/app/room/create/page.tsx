"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gift, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateRoomPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
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
    <main className="min-h-screen bg-amber-50">
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-amber-600">
          <Gift className="w-6 h-6" />
          GiftPool
        </Link>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-10">
        <Link href="/dashboard" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Start a gift mission</h1>
        <p className="text-gray-400 text-sm mb-8">Fill in the details and share the link with your group.</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Gift title</label>
            <input
              type="text"
              placeholder="e.g. Rohan's Birthday Gift"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description (optional)</label>
            <textarea
              placeholder="What's the gift? Any message for the group?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-300 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Target amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
              min={1}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 text-white rounded-xl py-3 font-bold hover:bg-amber-600 transition disabled:opacity-60 mt-2"
          >
            {loading ? "Creating..." : "Create room"}
          </button>
        </form>
      </div>
    </main>
  );
}
