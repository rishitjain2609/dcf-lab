"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, Paperclip } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { GameAssumptions, GameCompany } from "@/lib/game";
import { createClient } from "@/lib/supabase/client";
import { hasSupabase } from "@/lib/supabase/env";
import { publishModelAction } from "@/lib/community-actions";

export function PublishStep({
  company,
  assumptions,
  impliedPrice,
  marketPrice,
  onRestart,
}: {
  company: GameCompany;
  assumptions: GameAssumptions;
  impliedPrice: number;
  marketPrice: number;
  onRestart: () => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);
  const [thesis, setThesis] = useState("");
  const [visibility, setVisibility] = useState<"public" | "unlisted" | "private">("public");
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [publishedId, setPublishedId] = useState<string | null>(null);

  // Same deliberate post-mount check as UserMenu: auth state is client-only,
  // so this can't be a lazy useState initializer without risking a hydration
  // mismatch between the server-rendered and first-client-render markup.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!hasSupabase()) {
      setChecked(true);
      return;
    }
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        setUser(data.user);
        setChecked(true);
      });
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handlePublish() {
    setStatus("saving");
    setError(null);
    const result = await publishModelAction({
      companySlug: company.slug,
      thesis,
      visibility,
      assumptions,
      impliedPrice,
      marketPriceAtPublish: marketPrice,
    });
    if ("error" in result) {
      setStatus("error");
      setError(result.error);
      return;
    }
    setStatus("done");
    setPublishedId(result.id);
  }

  if (status === "done" && publishedId) {
    return (
      <div className="rounded-2xl bg-card p-6 text-center ring-1 ring-border">
        <p className="font-medium">Published</p>
        <p className="mt-1 text-sm text-muted">Your {company.company} model is live.</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href={`/models/community/${publishedId}`} className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white">
            View your model
          </Link>
          <button type="button" onClick={onRestart} className="rounded-full bg-foreground/10 px-5 py-2 text-sm font-medium hover:bg-foreground/15">
            Build another
          </button>
        </div>
      </div>
    );
  }

  const locked = !checked || !hasSupabase() || !user;

  return (
    <div>
      <h2 className="text-xl font-semibold">Publish</h2>
      <p className="mt-1 text-sm text-muted">
        Share your {company.company} model with the community, or keep it to yourself.
      </p>

      <div className="relative mt-6 overflow-hidden rounded-2xl ring-1 ring-border">
        <div className={`space-y-5 bg-card p-5 ${locked ? "pointer-events-none opacity-60" : ""}`}>
          <div>
            <label className="text-sm font-medium" htmlFor="thesis">
              Your thesis
            </label>
            <textarea
              id="thesis"
              rows={4}
              value={thesis}
              onChange={(e) => setThesis(e.target.value)}
              disabled={locked}
              placeholder="Why these assumptions? What would change your mind?"
              className="mt-1 w-full rounded-xl bg-background px-3 py-2 text-sm ring-1 ring-border focus:ring-accent"
            />
          </div>
          <div>
            <p className="text-sm font-medium">Visibility</p>
            <div className="mt-2 flex gap-4 text-sm">
              {(["public", "unlisted", "private"] as const).map((option) => (
                <label key={option} className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="visibility"
                    disabled={locked}
                    checked={visibility === option}
                    onChange={() => setVisibility(option)}
                  />
                  <span className="capitalize">{option}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="button" disabled className="flex items-center gap-2 rounded-full bg-foreground/10 px-4 py-2 text-sm font-medium">
            <Paperclip className="h-4 w-4" aria-hidden="true" />
            Attach your spreadsheet (coming soon)
          </button>
          {error && <p className="text-sm text-series-down">{error}</p>}
          <button
            type="button"
            onClick={handlePublish}
            disabled={locked || !thesis.trim() || status === "saving"}
            className="w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            {status === "saving" ? "Publishing…" : "Publish my model"}
          </button>
        </div>

        {locked && checked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70 px-6 text-center backdrop-blur-[1px]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Lock className="h-4 w-4" aria-hidden="true" />
            </span>
            {!hasSupabase() ? (
              <>
                <p className="text-sm font-medium">Publishing needs a database</p>
                <p className="max-w-sm text-xs text-muted">Accounts aren&apos;t connected yet, check back soon.</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium">Publishing needs an account</p>
                <Link href="/sign-in" className="mt-1 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-white">
                  Sign in
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button type="button" onClick={onRestart} className="rounded-full bg-foreground/10 px-5 py-2 text-sm font-medium hover:bg-foreground/15">
          Start over
        </button>
      </div>
    </div>
  );
}
