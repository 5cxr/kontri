"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface Contribution {
  id: string;
  amount: number;
  status: string;
  note: string | null;
  user: { id: string; name: string };
}

interface ContributionListProps {
  contributions: Contribution[];
  roomId: string;
  isHost: boolean;
  currentUserId: string;
}

export default function ContributionList({ contributions, roomId, isHost, currentUserId }: ContributionListProps) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);

  const hasContributed = contributions.some((c) => c.user.id === currentUserId);

  async function submitContribution() {
    if (!amount) return;
    setLoading(true);
    const res = await fetch(`/api/rooms/${roomId}/contributions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, note }),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error("Failed to submit contribution");
    } else {
      toast.success("Contribution submitted! Waiting for host to confirm.");
      setAmount("");
      setNote("");
      router.refresh();
    }
  }

  async function confirmContribution(id: string) {
    setConfirming(id);
    const res = await fetch(`/api/contributions/${id}/confirm`, { method: "PATCH" });
    setConfirming(null);
    if (!res.ok) {
      toast.error("Failed to confirm");
    } else {
      toast.success("Contribution confirmed!");
      router.refresh();
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
      <h2 className="font-bold text-gray-900 text-lg">Contributions</h2>

      {/* Add contribution form */}
      {!hasContributed && !isHost && (
        <div className="bg-amber-50 rounded-xl p-4 flex flex-col gap-3 border border-amber-100">
          <p className="text-sm font-semibold text-gray-700">Mark your contribution</p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300"
            />
            <input
              type="text"
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
          <button
            onClick={submitContribution}
            disabled={loading || !amount}
            className="flex items-center justify-center gap-2 bg-amber-500 text-white rounded-xl py-2 font-bold hover:bg-amber-600 transition disabled:opacity-60 text-sm"
          >
            <Plus className="w-4 h-4" />
            {loading ? "Submitting..." : "I&apos;ve paid"}
          </button>
        </div>
      )}

      {/* List */}
      {contributions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No contributions yet. Be the first!</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {contributions.map((c) => (
            <li key={c.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <div>
                <p className="font-semibold text-sm text-gray-800">{c.user.name}</p>
                {c.note && <p className="text-xs text-gray-400">{c.note}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-amber-600">₹{c.amount.toLocaleString()}</span>
                {c.status === "confirmed" ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <span className="flex items-center gap-1 text-xs text-orange-400">
                    <Clock className="w-4 h-4" />
                    Pending
                  </span>
                )}
                {isHost && c.status === "pending" && (
                  <button
                    onClick={() => confirmContribution(c.id)}
                    disabled={confirming === c.id}
                    className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition disabled:opacity-60"
                  >
                    {confirming === c.id ? "..." : "Confirm"}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
