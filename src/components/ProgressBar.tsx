"use client";
import { motion } from "framer-motion";

interface ProgressBarProps {
  collected: number;
  target: number;
  progress: number;
}

const milestones = [25, 50, 75, 100];

export default function ProgressBar({ collected, target, progress }: ProgressBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-800 dark:text-gray-100 text-lg">
          ₹{collected.toLocaleString()}
          <span className="text-gray-400 dark:text-gray-500 font-normal text-sm"> raised</span>
        </span>
        <span className="text-amber-600 dark:text-amber-400 font-bold text-lg">{Math.round(progress)}%</span>
      </div>

      {/* Bar */}
      <div className="relative w-full bg-amber-100 dark:bg-amber-900/30 rounded-full h-6 overflow-hidden">
        <motion.div
          className="h-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        {/* Milestone markers */}
        {milestones.map((m) => (
          <div
            key={m}
            className="absolute top-0 bottom-0 w-0.5 bg-white/60 dark:bg-zinc-900/40"
            style={{ left: `${m}%` }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400 dark:text-gray-500">
        <span>Goal: ₹{target.toLocaleString()}</span>
        <span>
          {target - collected > 0
            ? `Only ₹${(target - collected).toLocaleString()} left to unlock the surprise`
            : "Goal reached!"}
        </span>
      </div>

      {/* Milestones */}
      <div className="flex gap-2 flex-wrap mt-1">
        {milestones.map((m) => (
          <span
            key={m}
            className={`text-xs px-2 py-1 rounded-full font-semibold ${
              progress >= m
                ? "bg-amber-500 text-white"
                : "bg-amber-100 dark:bg-amber-900/30 text-amber-400 dark:text-amber-600"
            }`}
          >
            {m}%
          </span>
        ))}
      </div>
    </div>
  );
}
