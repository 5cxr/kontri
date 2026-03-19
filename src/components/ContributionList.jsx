"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";

export default function ContributionList({
  contributions,
  roomId,
  isHost,
  currentUserId,
  splitAmount,
  isMember,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(null);

  const hasContributed = contributions.some((c) => c.user.id === currentUserId);

  async function markAsPaid() {
    if (!splitAmount) return;
    setLoading(true);
    const res = await fetch(`/api/rooms/${roomId}/contributions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: splitAmount }),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error("Failed to submit");
    } else {
      toast.success("Marked as paid! Waiting for host to confirm.");
      router.refresh();
    }
  }

  async function confirmContribution(id) {
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
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col gap-4 border border-gray-200 dark:border-white/10">
      <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Payments</h2>

      {/* Mark as paid button — only for non-host members who haven't paid yet (host is auto-confirmed at lock) */}
      {isMember && !hasContributed && !isHost && splitAmount && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your share</p>
            <p className="text-2xl font-extrabold text-green-600 dark:text-green-400 flex items-center gap-1">
              <IndianRupee className="w-5 h-5" />
              {splitAmount.toLocaleString()}
            </p>
          </div>
          <button
            onClick={markAsPaid}
            disabled={loading}
            className="px-5 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition disabled:opacity-60 text-sm whitespace-nowrap"
          >
            {loading ? "Marking..." : "I've paid ✓"}
          </button>
        </div>
      )}

      {/* List */}
      {contributions.length === 0 ? (
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          <p className="text-sm">No payments yet. Members will appear here once they mark as paid.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {contributions.map((c) => (
            <li key={c.id} className="flex items-center justify-between bg-gray-50 dark:bg-slate-700/50 rounded-xl px-4 py-3">
              <div>
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{c.user.name}</p>
                {c.note && <p className="text-xs text-gray-400 dark:text-gray-500">{c.note}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-green-600 dark:text-green-400">₹{c.amount.toLocaleString()}</span>
                {c.status === "confirmed" ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <span className="flex items-center gap-1 text-xs text-yellow-500 dark:text-yellow-400">
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
