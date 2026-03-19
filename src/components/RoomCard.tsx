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
    ? "bg-green-100 text-green-700"
    : room.status === "expired"
    ? "bg-red-100 text-red-600"
    : "bg-amber-100 text-amber-700";

  return (
    <Link href={`/room/${room.id}`} className="block bg-white rounded-2xl shadow hover:shadow-md transition p-5 border border-gray-100">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {isHost && <Crown className="w-4 h-4 text-amber-500" />}
            <h3 className="font-bold text-gray-900 truncate">{room.title}</h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{isHost ? "You&apos;re hosting" : `by ${room.host.name}`}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${statusColor}`}>
          {room.status === "completed" ? "Done!" : room.status === "expired" ? "Expired" : "Active"}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-amber-100 rounded-full h-3 mb-2">
        <div
          className="bg-amber-500 h-3 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-700 font-semibold">
          ₹{room.collectedAmount.toLocaleString()}
          <span className="text-gray-400 font-normal"> / ₹{room.targetAmount.toLocaleString()}</span>
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          {daysLeft <= 0 ? "Overdue" : `${daysLeft}d left`}
        </span>
      </div>
    </Link>
  );
}
