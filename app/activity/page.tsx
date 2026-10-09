import { PageHero } from "@/components/page-hero-banner";
import { AnimatedCounter } from "@/components/animated-counter";
import { CommentCard } from "@/components/activity/comment-card";
import { CommentForm } from "@/components/activity/comment-form";
import { getApprovedComments } from "@/lib/activity";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const comments = await getApprovedComments();

  return (
    <div>
      <PageHero
        src="/images/students-laptop.jpg"
        alt="People collaborating around a laptop"
        video="/videos/team-collaboration.mp4"
        kicker="ACTIVITY"
        kickerClassName="text-emerald-300"
        title="Activity"
        description="What people building their own DCFs here have said, and a place to add yours."
      />
      <div className="mx-auto max-w-5xl space-y-12 px-4 pb-16 pt-12">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-foreground/5 p-8 text-center sm:flex-row sm:text-left">
          <p className="font-[family-name:var(--font-display)] text-6xl font-semibold italic text-emerald-600 dark:text-emerald-400">
            <AnimatedCounter to={200} suffix="+" />
          </p>
          <p className="text-lg text-foreground/70">
            people have used DCF Lab to build their own valuation so far. The comments below are feedback on
            specific pages and models.
          </p>
        </div>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold italic">Feedback</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {comments.map((comment, i) => (
              <CommentCard key={comment.id} comment={comment} index={i} />
            ))}
          </div>
        </section>

        <CommentForm />
      </div>
    </div>
  );
}
