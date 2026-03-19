"use client";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function getStatus(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const diffMs = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs <= 0) return { label: "Overdue", color: "text-red-500", urgent: true };
  if (diffDays === 1) return { label: "Due today!", color: "text-red-500", urgent: true };
  if (diffDays <= 3) return { label: `${diffDays} days left`, color: "text-orange-500", urgent: true };
  return { label: `${diffDays} days left`, color: "text-green-600 dark:text-green-400", urgent: false };
}

export default function CountdownTimer({ deadline }) {
  const [status, setStatus] = useState(getStatus(deadline));

  useEffect(() => {
    const interval = setInterval(() => setStatus(getStatus(deadline)), 60_000);
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div className="flex items-center gap-3">
      <Clock className={`w-5 h-5 ${status.color}`} />
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Deadline</p>
        <p className={`font-bold text-sm ${status.color}`}>
          {status.label}
          {status.urgent && " ⏰"}
        </p>
      </div>
      <div className="ml-auto text-xs text-gray-400 dark:text-gray-500">
        {new Date(deadline).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </div>
    </div>
  );
}
