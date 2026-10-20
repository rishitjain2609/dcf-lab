"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (signInError) {
      setStatus("error");
      setError(signInError.message);
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl bg-card p-6 text-center ring-1 ring-border">
        <p className="font-medium">Check your email</p>
        <p className="mt-1 text-sm text-muted">We sent a sign-in link to {email}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-card p-6 ring-1 ring-border">
      <label htmlFor="email" className="text-sm font-medium">
        Email
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="mt-1 w-full rounded-xl bg-background px-3 py-2 text-base outline-none ring-1 ring-border focus:ring-accent"
      />
      {error && <p className="mt-2 text-sm text-series-down">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-4 w-full rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send sign-in link"}
      </button>
      <p className="mt-3 text-xs text-muted">
        No password. We&apos;ll email you a one-time link that signs you in.
      </p>
    </form>
  );
}
