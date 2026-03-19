import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Gift, LogOut } from "lucide-react";
import RoomCard from "@/components/RoomCard";
import DeleteRoomButton from "@/components/DeleteRoomButton";
import DarkModeToggle from "@/components/DarkModeToggle";
import { signOut } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const rooms = await prisma.room.findMany({
    where: {
      OR: [
        { hostId: session.user.id },
        { members: { some: { userId: session.user.id } } },
      ],
    },
    include: { host: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen doodle-bg">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white/90 dark:bg-slate-950/80 backdrop-blur-sm border-b border-gray-200/80 dark:border-white/10">
        <Link href="/" className="flex items-center gap-2 font-black text-xl">
          <Gift className="w-6 h-6 text-green-500 dark:text-green-400" />
          <span className="bg-gradient-to-r from-green-500 via-yellow-400 to-pink-500 dark:from-green-400 dark:via-yellow-300 dark:to-pink-400 bg-clip-text text-transparent">
            Kontri
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-slate-400 hidden sm:block">Hey, {session.user.name}!</span>
          <DarkModeToggle />
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}>
            <button type="submit" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition" aria-label="Sign out">
              <LogOut className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Your rooms</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1">All your gift missions, in one place.</p>
          </div>
          <Link
            href="/room/create"
            className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition shadow-md shadow-green-500/20"
          >
            <Plus className="w-4 h-4" />
            New room
          </Link>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-white/20">
            <Gift className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-gray-700 dark:text-white font-semibold">No rooms yet.</p>
            <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">Create one and start the gifting mission!</p>
            <Link href="/room/create" className="mt-4 inline-block px-5 py-2 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition">
              Create room
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <div key={room.id} className="relative group">
                <RoomCard room={room} currentUserId={session.user.id} />
                {room.hostId === session.user.id && room.status !== "completed" && room.status !== "expired" && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DeleteRoomButton roomId={room.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
