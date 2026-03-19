import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Gift, Crown, Users, CheckCircle } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import CountdownTimer from "@/components/CountdownTimer";
import ContributionList from "@/components/ContributionList";
import CopyInviteButton from "@/components/CopyInviteButton";
import DarkModeToggle from "@/components/DarkModeToggle";
import JoinRoomButton from "@/components/JoinRoomButton";
import LockRoomButton from "@/components/LockRoomButton";

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      host: { select: { id: true, name: true } },
      members: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { joinedAt: "asc" },
      },
      contributions: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!room) notFound();
  if (room.status === "completed") redirect(`/room/${id}/celebrate`);

  const isHost = room.hostId === session.user.id;
  const isMember = room.members.some((m) => m.userId === session.user.id);
  const progress = Math.min((room.collectedAmount / room.targetAmount) * 100, 100);
  const inviteUrl = `${process.env.NEXTAUTH_URL}/room/${id}`;
  const previewSplit = room.members.length > 0
    ? Math.round(room.targetAmount / room.members.length)
    : room.targetAmount;

  return (
    <main className="min-h-screen doodle-bg">
      <nav className="flex items-center justify-between px-8 py-4 bg-white/90 dark:bg-slate-950/80 backdrop-blur-sm border-b border-gray-200/80 dark:border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2 font-black text-xl">
          <Gift className="w-6 h-6 text-green-500 dark:text-green-400" />
          <span className="bg-gradient-to-r from-green-500 via-yellow-400 to-pink-500 dark:from-green-400 dark:via-yellow-300 dark:to-pink-400 bg-clip-text text-transparent">
            Kontri
          </span>
        </Link>
        <DarkModeToggle />
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">
        {/* Room header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-white/10">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">{room.title}</h1>
          {room.description && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{room.description}</p>}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Hosted by {room.host.name}</p>

          {/* Invite link */}
          <div className="mt-4 flex items-center gap-2 bg-gray-50 dark:bg-blue-900/20 border border-gray-200 dark:border-blue-800 rounded-xl px-4 py-3">
            <span className="text-xs text-gray-400 dark:text-gray-400">Invite link:</span>
            <span className="text-sm font-mono text-gray-600 dark:text-blue-400 truncate flex-1">{inviteUrl}</span>
            <CopyInviteButton url={inviteUrl} />
          </div>
        </div>

        {/* ── OPEN STATE: gathering members ── */}
        {room.status === "open" && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-white/10 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-500 dark:text-violet-400" />
                <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                  {room.members.length} {room.members.length === 1 ? "person" : "people"} joined
                </h2>
              </div>
              {room.members.length > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Split preview: ₹{previewSplit.toLocaleString()} each
                </span>
              )}
            </div>

            {/* Member list */}
            {room.members.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {room.members.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl px-4 py-3">
                    <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-xs font-bold text-violet-600 dark:text-violet-400">
                      {m.user.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{m.user.name}</span>
                    {m.userId === room.hostId && (
                      <span className="ml-auto flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                        <Crown className="w-3 h-3" />
                        Host
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-4">
                No one has joined yet. Share the invite link!
              </p>
            )}

            {/* Join button for non-members */}
            {!isMember && <JoinRoomButton roomId={id} />}

            {/* Waiting message for non-host members */}
            {isMember && !isHost && (
              <div className="text-center py-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-sm font-semibold text-green-700 dark:text-green-400">You&apos;re in!</p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">Waiting for the host to lock in the split…</p>
              </div>
            )}

            {/* Lock button for host */}
            {isHost && room.members.length > 0 && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                  Once you lock, no new members can join and the split is fixed.
                </p>
                <LockRoomButton
                  roomId={id}
                  memberCount={room.members.length}
                  splitAmount={previewSplit}
                />
              </div>
            )}

            {/* Host with no members yet */}
            {isHost && room.members.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">
                Share the invite link above to get people to join first.
              </p>
            )}
          </div>
        )}

        {/* ── ACTIVE STATE: split locked, collecting payments ── */}
        {room.status === "active" && (
          <>
            {/* Split info banner */}
            <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl px-5 py-4 border border-violet-200 dark:border-violet-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-violet-500 dark:text-violet-400 font-semibold uppercase tracking-wide">Split locked</p>
                <p className="text-2xl font-extrabold text-violet-700 dark:text-violet-300">
                  ₹{room.splitAmount?.toLocaleString()} <span className="text-sm font-normal text-violet-500 dark:text-violet-400">per person</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-violet-500 dark:text-violet-400">{room.members.length} members</p>
                <p className="text-xs text-violet-400 dark:text-violet-500">Goal: ₹{room.targetAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-white/10">
              <ProgressBar collected={room.collectedAmount} target={room.targetAmount} progress={progress} />
            </div>

            {/* Countdown */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 border border-gray-200 dark:border-white/10">
              <CountdownTimer deadline={room.deadline.toISOString()} />
            </div>

            {/* Contributions */}
            <ContributionList
              contributions={room.contributions}
              roomId={id}
              isHost={isHost}
              currentUserId={session.user.id}
              splitAmount={room.splitAmount}
              isMember={isMember}
            />
          </>
        )}

        {/* ── EXPIRED STATE ── */}
        {room.status === "expired" && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-white/10 text-center">
            <p className="text-4xl mb-3">😔</p>
            <p className="font-bold text-gray-900 dark:text-white text-xl">This room has expired</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">The deadline has passed.</p>
          </div>
        )}
      </div>
    </main>
  );
}
