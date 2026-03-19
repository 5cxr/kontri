import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Gift } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import CountdownTimer from "@/components/CountdownTimer";
import ContributionList from "@/components/ContributionList";
import CopyInviteButton from "@/components/CopyInviteButton";
import DarkModeToggle from "@/components/DarkModeToggle";

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
    <main className="min-h-screen doodle-bg">
      <nav className="flex items-center justify-between px-8 py-4 bg-blue-900/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2 font-black text-xl">
          <Gift className="w-6 h-6 text-green-400" />
          <span className="bg-gradient-to-r from-green-400 via-yellow-300 to-pink-400 bg-clip-text text-transparent">
            Kontri
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${room.status === "active" ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"}`}>
            {room.status === "active" ? "Mission in progress 🎯" : "Expired"}
          </span>
          <DarkModeToggle />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">
        {/* Room header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-white/10">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">{room.title}</h1>
          {room.description && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{room.description}</p>}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Hosted by {room.host.name}</p>

          {/* Invite link */}
          <div className="mt-4 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">Invite link:</span>
            <span className="text-sm font-mono text-blue-700 dark:text-blue-400 truncate flex-1">{inviteUrl}</span>
            <CopyInviteButton url={inviteUrl} />
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-white/10">
          <ProgressBar collected={room.collectedAmount} target={room.targetAmount} progress={progress} />
        </div>

        {/* Countdown */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 border border-white/10">
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
