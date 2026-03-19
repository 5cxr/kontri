"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetch } from "@/lib/useFetch";
import confetti from "canvas-confetti";
import Link from "next/link";
import { Gift, Star } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function CelebratePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: room, loading } = useFetch(`/api/rooms/${id}`);

  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#22c55e", "#facc15", "#f97316", "#ec4899", "#8b5cf6", "#38bdf8"],
      });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen doodle-bg flex items-center justify-center">
        <p className="text-gray-700 dark:text-white font-bold text-xl animate-pulse">Loading celebration...</p>
      </main>
    );
  }

  if (!room) {
    router.push("/dashboard");
    return null;
  }

  const confirmed = room.contributions.filter((c) => c.status === "confirmed");

  return (
    <main className="min-h-screen doodle-bg flex flex-col items-center justify-center px-6 py-12">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>

      {/* Header */}
      <Link href="/dashboard" className="flex items-center gap-2 font-black text-xl mb-10">
        <Gift className="w-6 h-6 text-green-500 dark:text-green-400" />
        <span className="bg-gradient-to-r from-green-500 via-yellow-400 to-pink-500 dark:from-green-400 dark:via-yellow-300 dark:to-pink-400 bg-clip-text text-transparent">
          Kontri
        </span>
      </Link>

      {/* Celebration card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-10 max-w-md w-full text-center flex flex-col items-center gap-4 border border-gray-200 dark:border-white/10">
        <div className="text-6xl">🎉</div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50">Goal reached!</h1>
        <p className="text-green-600 dark:text-green-400 font-semibold text-lg">{room.title}</p>
        {room.description && <p className="text-gray-400 dark:text-gray-500 text-sm">{room.description}</p>}

        <div className="w-full bg-green-100 dark:bg-green-900/30 rounded-full h-5 mt-2">
          <div className="bg-green-500 h-5 rounded-full w-full" />
        </div>
        <p className="font-bold text-gray-800 dark:text-gray-100">
          ₹{room.collectedAmount.toLocaleString()} raised of ₹{room.targetAmount.toLocaleString()}
        </p>

        <div className="w-full text-left mt-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            Contributors
          </p>
          {confirmed.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm">No confirmed contributors yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {confirmed.map((c) => (
                <li key={c.id} className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{c.user.name}</span>
                  <span className="text-sm text-green-600 dark:text-green-400 font-bold">₹{c.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link href="/dashboard" className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
