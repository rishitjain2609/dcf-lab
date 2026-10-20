import { PageHero } from "@/components/page-hero-banner";
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
        title="Activity"
        description="Used the guide, a model or the builder? Tell me what worked and what didn't."
      />
      <div className="mx-auto max-w-5xl space-y-12 px-4 pb-16 pt-12">
        {comments.length > 0 && (
          <section>
            <h2 className="text-2xl font-extrabold">Feedback</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {comments.map((comment, i) => (
                <CommentCard key={comment.id} comment={comment} index={i} />
              ))}
            </div>
          </section>
        )}

        <CommentForm />
      </div>
    </div>
  );
}
