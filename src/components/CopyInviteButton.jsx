"use client";
import toast from "react-hot-toast";

export default function CopyInviteButton({ url }) {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(url);
        toast.success("Link copied!");
      }}
      className="text-xs bg-amber-500 text-white px-3 py-1 rounded-lg hover:bg-amber-600 transition"
    >
      Copy
    </button>
  );
}
