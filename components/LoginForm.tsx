"use client";

import { useState } from "react";
import { getSupabaseBrowser } from "../lib/supabase-browser";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin() {
    try {
      const supabase = getSupabaseBrowser();


      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : "";

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Magic link sent. Check your email.");
    } catch {
      setMessage("Something went wrong.");
    }
  }

  return (
    <div className="mt-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Email
      </label>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full border border-gray-300 rounded-xl px-4 py-3"
      />

      <button
        onClick={handleLogin}
        className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700"
      >
        Send Magic Link
      </button>

      {message ? <p className="mt-4 text-sm text-gray-600">{message}</p> : null}
    </div>
  );
}