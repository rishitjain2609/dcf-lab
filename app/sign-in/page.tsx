import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/sign-in-form";
import { hasSupabase } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Sign in — DCF Lab",
};

export default function SignInPage() {
  return (
    <div className="analyst-scope bg-background text-foreground">
      <div className="mx-auto max-w-sm px-4 py-16">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-muted">You need an account to publish models, comment, or vote. Browsing is always open.</p>
        <div className="mt-6">
          {hasSupabase() ? (
            <SignInForm />
          ) : (
            <p className="rounded-2xl bg-card p-6 text-sm text-muted ring-1 ring-border">
              Accounts aren&apos;t connected yet, check back soon.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
