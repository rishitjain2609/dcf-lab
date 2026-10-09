import type { ActivityComment } from "@/lib/activity";

const TINTS = [
  "bg-violet-50 dark:bg-violet-950/30",
  "bg-indigo-50 dark:bg-indigo-950/30",
  "bg-emerald-50 dark:bg-emerald-950/30",
  "bg-amber-50 dark:bg-amber-950/30",
  "bg-rose-50 dark:bg-rose-950/30",
  "bg-sky-50 dark:bg-sky-950/30",
];

export function CommentCard({ comment, index }: { comment: ActivityComment; index: number }) {
  return (
    <div className={`rounded-3xl p-6 ${TINTS[index % TINTS.length]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold">{comment.name}</p>
          {comment.role && <p className="text-sm text-foreground/60">{comment.role}</p>}
        </div>
        <span className="flex-shrink-0 rounded-full bg-background/50 px-3 py-1 text-xs font-medium text-foreground/60">
          {comment.project}
        </span>
      </div>
      <p className="mt-3 text-base leading-7 text-foreground/80">{comment.body}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-foreground/50">
        <span>{comment.createdAt}</span>
        {comment.placeholder && (
          <span className="rounded-full bg-background/50 px-2 py-0.5 font-medium text-amber-700 dark:text-amber-400">
            Sample placeholder
          </span>
        )}
      </div>
    </div>
  );
}
