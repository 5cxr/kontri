import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Gift } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import CountdownTimer from "@/components/CountdownTimer";
import ContributionList from "@/components/ContributionList";

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      host: { select: { id: true, name: true } },
      contributions: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!room) notFound();
  if (room.status === "completed") redirect(`/room/${id}/celebrate`);

  const isHost = room.hostId === session.user.id;
  const progress = Math.min((room.collectedAmount / room.targetAmount) * 100, 100);
  const inviteUrl = `${process.env.NEXTAUTH_URL}/room/${id}`;

  return (
    <main className="min-h-screen bg-amber-50">
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-amber-600">
          <Gift className="w-6 h-6" />
          GiftPool
        </Link>
        <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-3 py-1 rounded-full">
          {room.status === "active" ? "Gift mission in progress" : "Expired"}
        </span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">
        {/* Room header */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h1 className="text-2xl font-extrabold text-gray-900">{room.title}</h1>
          {room.description && <p className="text-gray-500 text-sm mt-1">{room.description}</p>}
          <p className="text-xs text-gray-400 mt-2">Hosted by {room.host.name}</p>

          {/* Invite code */}
          <div className="mt-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <span className="text-xs text-gray-500">Invite link:</span>
            <span className="text-sm font-mono text-amber-700 truncate flex-1">{inviteUrl}</span>
            <button
              onClick={() => navigator.clipboard.writeText(inviteUrl)}
              className="text-xs bg-amber-500 text-white px-3 py-1 rounded-lg hover:bg-amber-600 transition"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl shadow p-6">
          <ProgressBar
            collected={room.collectedAmount}
            target={room.targetAmount}
            progress={progress}
          />
        </div>

        {/* Countdown */}
        <div className="bg-white rounded-2xl shadow p-4">
          <CountdownTimer deadline={room.deadline.toISOString()} />
        </div>

        {/* Contributions */}
        <ContributionList
          contributions={room.contributions}
          roomId={id}
          isHost={isHost}
          currentUserId={session.user.id}
        />
      </div>
    </main>
  );
}
