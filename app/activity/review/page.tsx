import { getPendingComments, hasDatabase } from "@/lib/activity";
import { approveCommentAction, rejectCommentAction } from "@/lib/activity-actions";

export const dynamic = "force-dynamic";

export default async function ActivityReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const secret = process.env.REVIEW_SECRET;
  const authorized = Boolean(secret) && key === secret;

  if (!authorized) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center text-foreground/60">Not found.</div>
    );
  }

  if (!hasDatabase()) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center text-foreground/60">
        No database is connected yet, so there is nothing to review.
      </div>
    );
  }

  const pending = await getPendingComments();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold italic">
        Pending feedback ({pending.length})
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Only visible with the right key. Approve to publish on /activity, or reject to discard.
      </p>
      <div className="mt-8 space-y-4">
        {pending.length === 0 && <p className="text-foreground/60">Nothing waiting for review.</p>}
        {pending.map((comment) => (
          <div key={comment.id} className="rounded-3xl bg-foreground/5 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{comment.name}</p>
                {comment.role && <p className="text-sm text-foreground/60">{comment.role}</p>}
              </div>
              <span className="rounded-full bg-background/60 px-3 py-1 text-xs font-medium">{comment.project}</span>
            </div>
            <p className="mt-3 text-base leading-7 text-foreground/80">{comment.body}</p>
            <p className="mt-2 text-xs text-foreground/50">{comment.createdAt}</p>
            <div className="mt-4 flex gap-3">
              <form action={approveCommentAction}>
                <input type="hidden" name="key" value={key} />
                <input type="hidden" name="id" value={comment.id} />
                <button
                  type="submit"
                  className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Approve
                </button>
              </form>
              <form action={rejectCommentAction}>
                <input type="hidden" name="key" value={key} />
                <input type="hidden" name="id" value={comment.id} />
                <button
                  type="submit"
                  className="rounded-full bg-rose-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-rose-700"
                >
                  Reject
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
