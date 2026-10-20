import type { ReactNode } from "react";

export function GuideIllustration({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="my-6 flex flex-col items-center rounded-2xl bg-foreground/5 px-6 py-8">
      <div className="w-full max-w-xs">{children}</div>
      <figcaption className="mt-3 text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}
