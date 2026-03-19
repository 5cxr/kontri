"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetch } from "@/lib/useFetch";
import confetti from "canvas-confetti";
import Link from "next/link";
import { Gift, Star } from "lucide-react";

interface Room {
  id: string;
  title: string;
  description: string | null;
  targetAmount: number;
  collectedAmount: number;
  host: { name: string };
  contributions: { id: string; user: { name: string }; amount: number; status: string }[];
}

export default function CelebratePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: room, loading } = useFetch<Room>(`/api/rooms/${id}`);

  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#fcd34d", "#fde68a", "#ef4444", "#10b981"],
      });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-amber-600 font-bold text-xl animate-pulse">Loading celebration...</p>
      </main>
    );
  }

  if (!room) {
    router.push("/dashboard");
    return null;
  }

  const confirmed = room.contributions.filter((c) => c.status === "confirmed");

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center px-6 py-12">
      {/* Header */}
      <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-amber-600 mb-10">
        <Gift className="w-6 h-6" />
        GiftPool
      </Link>

      {/* Celebration card */}
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center flex flex-col items-center gap-4">
        <div className="text-6xl">🎉</div>
        <h1 className="text-3xl font-extrabold text-gray-900">Goal reached!</h1>
        <p className="text-amber-600 font-semibold text-lg">{room.title}</p>
        {room.description && <p className="text-gray-400 text-sm">{room.description}</p>}

        {/* Full progress bar */}
        <div className="w-full bg-amber-100 rounded-full h-5 mt-2">
          <div className="bg-amber-500 h-5 rounded-full w-full" />
        </div>
        <p className="font-bold text-gray-800">
          ₹{room.collectedAmount.toLocaleString()} raised of ₹{room.targetAmount.toLocaleString()}
        </p>

        {/* Contributors */}
        <div className="w-full text-left mt-2">
          <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400" />
            Contributors
          </p>
          {confirmed.length === 0 ? (
            <p className="text-gray-400 text-sm">No confirmed contributors yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {confirmed.map((c) => (
                <li key={c.id} className="flex items-center justify-between bg-amber-50 rounded-xl px-4 py-2">
                  <span className="text-sm font-medium text-gray-800">{c.user.name}</span>
                  <span className="text-sm text-amber-600 font-bold">₹{c.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link href="/dashboard" className="mt-4 px-6 py-3 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600 transition">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
