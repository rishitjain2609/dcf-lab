"use client";

import Link from "next/link";
import { useState } from "react";
import { formatMoneyPerShare, type Currency } from "@/lib/format";
import { stepClip } from "@/components/motif";

export interface ShowcaseModel {
  slug: string;
  company: string;
  shortName: string;
  ticker: string;
  currency: Currency;
  lede: string;
  impliedValuePerShare: number;
  priceAtPublish: number;
}

/** Square plate on the left, the model's facts on the right, one tab per real model. */
export function ModelShowcase({ models, image }: { models: ShowcaseModel[]; image: { src: string; alt: string } }) {
  const [active, setActive] = useState(0);
  const m = models[active];

  return (
    <div className="grid gap-10 lg:min-h-[88svh] lg:grid-cols-2 lg:items-center lg:gap-16">
      <div className="shutter aspect-square overflow-hidden">
        <div className="h-full w-full" style={{ clipPath: stepClip(5, 0.05) }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} alt={image.alt} width={1200} height={1200} loading="lazy" className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:min-h-[70svh] lg:justify-between">
        <div data-rise>
          <h2 className="t-head">
            Real models, from filings
          </h2>
          <div role="tablist" aria-label="Models" className="mt-8 flex gap-6">
            {models.map((model, i) => (
              <button
                key={model.slug}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`press t-body font-semibold underline-offset-[0.35em] decoration-2 ${
                  i === active ? "text-foreground underline" : "text-muted hover:text-foreground"
                }`}
              >
                {model.shortName}
              </button>
            ))}
          </div>
        </div>

        <div role="tabpanel" data-rise style={{ ["--i" as string]: 1 }}>
          <h3 className="t-lead">
            {m.company}
          </h3>
          <p className="t-small mt-1 text-muted">{m.ticker}</p>
          <p className="t-body mt-6 max-w-[38ch]">{m.lede}</p>
          <dl className="mt-8 grid max-w-md grid-cols-2 gap-6">
            <div>
              <dt className="t-small text-muted">Implied value</dt>
              <dd className="t-lead tabular-nums">
                {formatMoneyPerShare(m.impliedValuePerShare, m.currency)}
              </dd>
            </div>
            <div>
              <dt className="t-small text-muted">Price at publish</dt>
              <dd className="t-lead tabular-nums">
                {formatMoneyPerShare(m.priceAtPublish, m.currency)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="grid grid-cols-2 gap-2" data-rise style={{ ["--i" as string]: 2 }}>
          <Link
            href={`/models/${m.slug}`}
            className="press flex h-[72px] items-center px-5 t-body font-semibold text-accent-ink bg-accent hover:bg-foreground/85"
          >
            Read the {m.shortName} model
          </Link>
          <Link href="/models" className="press flex h-[72px] items-center bg-card-strong px-5 t-body font-semibold hover:bg-card">
            All models
          </Link>
        </div>
      </div>
    </div>
  );
}
