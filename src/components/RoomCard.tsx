import Link from "next/link";
import { Clock, Crown } from "lucide-react";

interface Room {
  id: string;
  title: string;
  targetAmount: number;
  collectedAmount: number;
  deadline: Date;
  status: string;
  host: { id: string; name: string };
}

interface RoomCardProps {
  room: Room;
  currentUserId: string;
}

export default function RoomCard({ room, currentUserId }: RoomCardProps) {
  const progress = Math.min((room.collectedAmount / room.targetAmount) * 100, 100);
  const isHost = room.host.id === currentUserId;
  const daysLeft = Math.ceil((new Date(room.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const statusColor = room.status === "completed"
    ? "bg-green-500/15 text-green-400 border border-green-500/30"
    : room.status === "expired"
    ? "bg-red-500/15 text-red-400 border border-red-500/30"
    : "bg-blue-500/15 text-blue-300 border border-blue-400/30";

  return (
    <Link href={`/room/${room.id}`} className="block bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all p-5 border border-white/10">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {isHost && <Crown className="w-4 h-4 text-yellow-400" />}
            <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">{room.title}</h3>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{isHost ? "You're hosting" : `by ${room.host.name}`}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${statusColor}`}>
          {room.status === "completed" ? "Done!" : room.status === "expired" ? "Expired" : "Active"}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-green-100 dark:bg-green-900/30 rounded-full h-3 mb-2">
        <div
          className="bg-green-500 h-3 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-700 dark:text-gray-300 font-semibold">
          ₹{room.collectedAmount.toLocaleString()}
          <span className="text-gray-400 dark:text-gray-500 font-normal"> / ₹{room.targetAmount.toLocaleString()}</span>
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
          <Clock className="w-3 h-3" />
          {daysLeft <= 0 ? "Overdue" : `${daysLeft}d left`}
        </span>
      </div>
    </Link>
  );
}
