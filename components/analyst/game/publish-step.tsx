"use client";

import { useState } from "react";
import { Lock, Paperclip } from "lucide-react";
import type { GameCompany } from "@/lib/game";

export function PublishStep({ company, onRestart }: { company: GameCompany; onRestart: () => void }) {
  const [visibility, setVisibility] = useState<"public" | "unlisted" | "private">("public");

  return (
    <div>
      <h2 className="text-xl font-semibold">Publish</h2>
      <p className="mt-1 text-sm text-muted">
        Share your {company.company} model with the community, or keep it to yourself.
      </p>

      <div className="relative mt-6 overflow-hidden rounded-2xl ring-1 ring-border">
        <div className="space-y-5 bg-card p-5 opacity-60">
          <div>
            <label className="text-sm font-medium" htmlFor="thesis">
              Your thesis
            </label>
            <textarea
              id="thesis"
              rows={4}
              disabled
              placeholder="Why these assumptions? What would change your mind?"
              className="mt-1 w-full rounded-xl bg-background px-3 py-2 text-sm ring-1 ring-border"
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
                    disabled
                    checked={visibility === option}
                    onChange={() => setVisibility(option)}
                  />
                  <span className="capitalize">{option}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="button"
            disabled
            className="flex items-center gap-2 rounded-full bg-foreground/10 px-4 py-2 text-sm font-medium"
          >
            <Paperclip className="h-4 w-4" aria-hidden="true" />
            Attach your spreadsheet
          </button>
          <button type="button" disabled className="w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-white">
            Publish my model
          </button>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70 px-6 text-center backdrop-blur-[1px]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Lock className="h-4 w-4" aria-hidden="true" />
          </span>
          <p className="text-sm font-medium">Publishing needs an account</p>
          <p className="max-w-sm text-xs text-muted">
            This is what it&apos;ll look like. Accounts, publishing, and the community feed land in the next phase of
            this rebuild.
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button type="button" onClick={onRestart} className="rounded-full bg-foreground/10 px-5 py-2 text-sm font-medium hover:bg-foreground/15">
          Start over
        </button>
      </div>
    </div>
  );
}
