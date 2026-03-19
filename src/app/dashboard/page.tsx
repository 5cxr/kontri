import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Gift, LogOut } from "lucide-react";
import RoomCard from "@/components/RoomCard";
import DarkModeToggle from "@/components/DarkModeToggle";
import { signOut } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const rooms = await prisma.room.findMany({
    where: {
      OR: [
        { hostId: session.user.id },
        { contributions: { some: { userId: session.user.id } } },
      ],
    },
    include: { host: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen doodle-bg">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-blue-900/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 font-black text-xl">
          <Gift className="w-6 h-6 text-green-400" />
          <span className="bg-gradient-to-r from-green-400 via-yellow-300 to-pink-400 bg-clip-text text-transparent">
            Kontri
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-blue-200 dark:text-slate-400 hidden sm:block">Hey, {session.user.name}!</span>
          <DarkModeToggle />
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}>
            <button type="submit" className="p-2 rounded-full hover:bg-white/10 transition" aria-label="Sign out">
              <LogOut className="w-5 h-5 text-blue-200" />
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Your rooms</h1>
            <p className="text-blue-200 dark:text-slate-400 mt-1">All your gift missions, in one place.</p>
          </div>
          <Link
            href="/room/create"
            className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-full font-bold hover:bg-green-400 transition shadow-lg shadow-green-500/30"
          >
            <Plus className="w-4 h-4" />
            New room
          </Link>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-20 bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-dashed border-white/30">
            <Gift className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-white font-semibold">No rooms yet.</p>
            <p className="text-blue-200 dark:text-slate-400 text-sm mt-1">Create one and start the gifting mission!</p>
            <Link href="/room/create" className="mt-4 inline-block px-5 py-2 bg-green-500 text-white rounded-full font-bold hover:bg-green-400 transition">
              Create room
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} currentUserId={session.user.id} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
