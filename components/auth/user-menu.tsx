"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { hasSupabase } from "@/lib/supabase/env";

export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);

  // Checking auth state is a client-only concern (it reads a cookie-backed
  // session), so this intentionally runs after mount rather than as a lazy
  // useState initializer, to keep the server-rendered and first-client-render
  // markup identical and avoid a hydration mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!hasSupabase()) {
      setChecked(true);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setChecked(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!hasSupabase() || !checked) return null;

  if (!user) {
    return (
      <Link href="/sign-in" className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white">
        Sign in
      </Link>
    );
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-foreground/80">{user?.email?.split("@")[0]}</span>
      <button type="button" onClick={signOut} className="text-foreground/50 hover:text-accent">
        Sign out
      </button>
    </div>
  );
}
