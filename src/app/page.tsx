import Link from "next/link";
import { Gift, Users, TrendingUp } from "lucide-react";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-amber-50 dark:bg-zinc-900 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white dark:bg-zinc-900 border-b border-amber-100 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-xl text-amber-600">
          <Gift className="w-6 h-6" />
          GiftPool
        </div>
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <Link href="/login" className="px-4 py-2 rounded-full border border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-zinc-800 transition">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition font-semibold">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
        <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-semibold px-4 py-1 rounded-full text-sm">
          Gift mission in progress 🎁
        </span>
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-50 max-w-2xl leading-tight">
          Group gifting made{" "}
          <span className="text-amber-500">ridiculously</span> easy
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl">
          Create a room, share the link, and watch the contributions roll in.
          No more awkward chat messages. The gang is assembling funds.
        </p>
        <div className="flex gap-4 mt-2">
          <Link href="/register" className="px-6 py-3 rounded-full bg-amber-500 text-white font-bold text-lg hover:bg-amber-600 transition shadow-lg">
            Create a room
          </Link>
          <Link href="/login" className="px-6 py-3 rounded-full border-2 border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400 font-bold text-lg hover:bg-amber-100 dark:hover:bg-zinc-800 transition">
            Join a room
          </Link>
        </div>

        {/* Demo progress card */}
        <div className="mt-10 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 w-full max-w-sm text-left border border-amber-100 dark:border-zinc-700">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-800 dark:text-gray-100">Rohan&apos;s Birthday 🎂</span>
            <span className="text-sm text-amber-600 font-semibold">68%</span>
          </div>
          <div className="w-full bg-amber-100 dark:bg-amber-900/30 rounded-full h-4 mb-2">
            <div className="bg-amber-500 h-4 rounded-full transition-all" style={{ width: "68%" }} />
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
          { icon: Gift, title: "Create a goal", desc: "Set the gift, amount, and deadline. Share a link in seconds." },
          { icon: Users, title: "The gang contributes", desc: "Everyone joins the room and marks their contribution." },
          { icon: TrendingUp, title: "Watch it fill up", desc: "Live progress bar fills as the host confirms payments." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex-1 bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
