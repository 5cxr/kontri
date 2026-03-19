"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function JoinRoomButton({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function join() {
    setLoading(true);
    const res = await fetch(`/api/rooms/${roomId}/join`, { method: "POST" });
    setLoading(false);
    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error || "Failed to join");
    } else {
      toast.success("You're in! Waiting for host to lock the split.");
      router.refresh();
    }
  }

  return (
    <button
      onClick={join}
      disabled={loading}
      className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold text-lg hover:bg-green-600 transition disabled:opacity-60 shadow-lg shadow-green-500/20"
    >
      {loading ? "Joining..." : "Join this pool 🎉"}
    </button>
  );
}
