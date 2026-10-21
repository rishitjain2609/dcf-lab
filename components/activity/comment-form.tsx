"use client";

import { useRef, useState, useTransition } from "react";
import { submitCommentAction } from "@/lib/activity-actions";

const PROJECTS = ["Why DCF", "Guide", "Models", "DCF builder"];

export function CommentForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ error?: string; ok?: boolean } | null>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await submitCommentAction(formData);
      setResult(res);
      if (res.ok) formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="relative rounded-3xl bg-foreground/5 p-6 sm:p-8">
      <h2 className="text-2xl font-extrabold">Add your feedback</h2>
      <p className="mt-1 text-sm text-foreground/60">
        Your comment shows up on this page as soon as you post it.
      </p>
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={80}
            className="mt-1 w-full rounded-xl bg-background px-3 py-2 text-base outline-none ring-1 ring-border focus:ring-accent"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="role">
            Role <span className="text-foreground/40">(optional)</span>
          </label>
          <input
            id="role"
            name="role"
            maxLength={80}
            placeholder="e.g. finance student, teacher"
            className="mt-1 w-full rounded-xl bg-background px-3 py-2 text-base outline-none ring-1 ring-border focus:ring-accent"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="text-sm font-medium" htmlFor="project">
          Which page or model
        </label>
        <select
          id="project"
          name="project"
          required
          defaultValue=""
          className="mt-1 w-full rounded-xl bg-background px-3 py-2 text-base outline-none ring-1 ring-border focus:ring-accent"
        >
          <option value="" disabled>
            Choose one
          </option>
          {PROJECTS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <label className="text-sm font-medium" htmlFor="body">
          Your feedback
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={4}
          maxLength={2000}
          className="mt-1 w-full rounded-xl bg-background px-3 py-2 text-base outline-none ring-1 ring-border focus:ring-accent"
        />
      </div>
      {result?.error && <p className="mt-3 text-sm text-rose-600 dark:text-rose-400">{result.error}</p>}
      {result?.ok && (
        <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
          Thanks, your comment is posted.
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="mt-5 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}
