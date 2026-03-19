import Link from "next/link";
import { Gift, Users, TrendingUp } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Home() {
  return (
    <main className="min-h-screen doodle-bg flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white/90 dark:bg-slate-950/80 backdrop-blur-sm border-b border-gray-200/80 dark:border-white/10">
        <div className="flex items-center gap-2 font-black text-xl">
          <Gift className="w-6 h-6 text-green-500 dark:text-green-400" />
          <span className="bg-gradient-to-r from-green-500 via-yellow-400 to-pink-500 dark:from-green-400 dark:via-yellow-300 dark:to-pink-400 bg-clip-text text-transparent">
            Kontri
          </span>
        </div>
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <Link href="/login" className="px-4 py-2 rounded-full border border-gray-300 dark:border-white/30 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition text-sm font-semibold">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition font-bold text-sm shadow-md shadow-green-500/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
        <span className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white font-semibold px-4 py-1 rounded-full text-sm border border-gray-300 dark:border-white/20">
          Gift mission in progress 🎁
        </span>
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white max-w-2xl leading-tight">
          Group gifting made{" "}
          <span className="bg-gradient-to-r from-green-500 to-yellow-400 dark:from-green-400 dark:to-yellow-300 bg-clip-text text-transparent">
            ridiculously
          </span>{" "}
          easy
        </h1>
        <p className="text-gray-600 dark:text-slate-400 text-lg max-w-xl">
          Create a room, share the link, and watch the contributions roll in.
          No more awkward chat messages. The gang is assembling funds.
        </p>
        <div className="flex gap-4 mt-2 flex-wrap justify-center">
          <Link href="/register" className="px-8 py-4 rounded-full bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition shadow-xl shadow-green-500/25">
            Create a room
          </Link>
          <Link href="/login" className="px-8 py-4 rounded-full bg-violet-500 text-white font-bold text-lg hover:bg-violet-600 transition shadow-xl shadow-violet-500/20">
            Join a room
          </Link>
        </div>

        {/* Demo progress card */}
        <div className="mt-10 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-sm text-left border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-800 dark:text-gray-100">Rohan&apos;s Birthday 🎂</span>
            <span className="text-sm text-green-600 dark:text-green-400 font-bold">68%</span>
          </div>
          <div className="w-full bg-green-100 dark:bg-green-900/30 rounded-full h-4 mb-2">
            <div className="bg-green-500 h-4 rounded-full" style={{ width: "68%" }} />
          </div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>₹6,800 raised</span>
            <span>Goal: ₹10,000</span>
          </div>
          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">Only ₹3,200 left to unlock the surprise</p>
        </div>
      </section>

      {/* Features */}
      <section className="flex flex-col md:flex-row gap-6 px-8 pb-20 justify-center items-stretch max-w-4xl mx-auto w-full">
        {[
          { icon: Gift, title: "Create a goal", desc: "Set the gift, amount, and deadline. Share a link in seconds.", accent: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-500/10" },
          { icon: Users, title: "The gang contributes", desc: "Everyone joins the room and marks their contribution.", accent: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-500/10" },
          { icon: TrendingUp, title: "Watch it fill up", desc: "Live progress bar fills as the host confirms payments.", accent: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-400/10" },
        ].map(({ icon: Icon, title, desc, accent, bg }) => (
          <div key={title} className="flex-1 bg-white dark:bg-slate-800/60 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${accent}`} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm">{desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
