"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function DeleteRoomButton({ roomId }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const res = await fetch(`/api/rooms/${roomId}`, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      toast.error("Failed to delete room");
      setConfirming(false);
    } else {
      toast.success("Room deleted");
      router.refresh();
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition disabled:opacity-60"
        >
          {loading ? "..." : "Delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs px-2 py-1 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-slate-500 transition"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); setConfirming(true); }}
      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
      aria-label="Delete room"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
