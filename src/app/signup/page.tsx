"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (res.ok) {
      // Auto-login after signup
      await signIn("credentials", { email, password, callbackUrl: "/account" });
    } else {
      const data = await res.json();
      setError(data.error || "Sign up failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9e7e1] to-[#f5f5fa]">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 shadow-2xl rounded-2xl p-8 w-full max-w-md border border-navy-100 backdrop-blur-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-navy-800 font-display">Sign Up</h1>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-navy-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-navy-200 rounded focus:outline-none focus:ring-2 focus:ring-navy-300 focus:border-navy-500 font-sans text-navy-800 bg-white/80"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-navy-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-navy-200 rounded focus:outline-none focus:ring-2 focus:ring-navy-300 focus:border-navy-500 font-sans text-navy-800 bg-white/80"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-navy-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-navy-200 rounded focus:outline-none focus:ring-2 focus:ring-navy-300 focus:border-navy-500 font-sans text-navy-800 bg-white/80"
            required
          />
        </div>
        {error && <div className="mb-4 text-red-600 text-sm font-semibold">{error}</div>}
        <button
          type="submit"
          className="w-full bg-navy-800 text-white py-2 rounded-lg hover:bg-navy-700 transition font-semibold shadow-md mt-2"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
} 