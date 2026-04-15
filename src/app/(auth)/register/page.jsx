"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gift } from "lucide-react";
import toast from "react-hot-toast";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    
    let isValid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");

    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/-]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError("Password needs 8+ characters, uppercase, lowercase, number, and special char.");
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error || "Something went wrong");
    } else {
      toast.success("Account created! Please log in.");
      router.push("/login");
    }
  }

  return (
    <main className="min-h-screen doodle-bg flex items-center justify-center px-4">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-sm border border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-2 justify-center mb-6 font-black text-xl">
          <Gift className="w-6 h-6 text-green-500 dark:text-green-400" />
          <span className="bg-gradient-to-r from-green-500 via-yellow-400 to-pink-500 dark:from-green-400 dark:via-yellow-300 dark:to-pink-400 bg-clip-text text-transparent">
            Kontri
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-center text-gray-900 dark:text-gray-50 mb-1">Join the party!</h2>
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm mb-6">Create your Kontri account</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 w-full">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(""); }}
              required
              className={`border ${nameError ? 'border-red-500 focus:ring-red-500 dark:border-red-500' : 'border-gray-200 dark:border-slate-600 focus:ring-green-400'} dark:bg-slate-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 text-gray-800 transition`}
            />
            {nameError && <span className="text-red-500 text-xs font-semibold ml-2">{nameError}</span>}
          </div>
          <div className="flex flex-col gap-1 w-full">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              required
              className={`border ${emailError ? 'border-red-500 focus:ring-red-500 dark:border-red-500' : 'border-gray-200 dark:border-slate-600 focus:ring-green-400'} dark:bg-slate-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 text-gray-800 transition`}
            />
            {emailError && <span className="text-red-500 text-xs font-semibold ml-2">{emailError}</span>}
          </div>
          <div className="flex flex-col gap-1 w-full">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
              required
              className={`border ${passwordError ? 'border-red-500 focus:ring-red-500 dark:border-red-500' : 'border-gray-200 dark:border-slate-600 focus:ring-green-400'} dark:bg-slate-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 text-gray-800 transition`}
            />
            {passwordError && <span className="text-red-500 text-xs font-semibold ml-2">{passwordError}</span>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white rounded-xl py-3 font-bold hover:bg-green-600 transition disabled:opacity-60 mt-2"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-green-600 dark:text-green-400 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
