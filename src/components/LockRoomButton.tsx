"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

interface LockRoomButtonProps {
  roomId: string;
  memberCount: number;
  splitAmount: number;
}

export default function LockRoomButton({ roomId, memberCount, splitAmount }: LockRoomButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function lock() {
    setLoading(true);
    const res = await fetch(`/api/rooms/${roomId}/lock`, { method: "POST" });
    setLoading(false);
    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error || "Failed to lock split");
    } else {
      toast.success("Split locked! Members can now mark their payments.");
      router.refresh();
    }
  }

  return (
    <button
      onClick={lock}
      disabled={loading}
      className="w-full py-4 bg-violet-500 text-white rounded-2xl font-bold text-lg hover:bg-violet-600 transition disabled:opacity-60 shadow-lg shadow-violet-500/20 flex items-center justify-center gap-3"
    >
      <Lock className="w-5 h-5" />
      {loading
        ? "Locking..."
        : `Lock split — ${memberCount} ${memberCount === 1 ? "member" : "members"} · ₹${splitAmount.toLocaleString()} each`}
    </button>
  );
}
