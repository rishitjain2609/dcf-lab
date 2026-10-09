import { ClipboardList, Building2, SlidersHorizontal, BarChart3, RotateCcw, Share2 } from "lucide-react";

const STEPS = [
  { icon: ClipboardList, title: "Concept check", description: "5 quick questions, no peeking at the answers yet." },
  { icon: Building2, title: "Pick a company", description: "A real, listed company across a few different sectors." },
  { icon: SlidersHorizontal, title: "Build the model", description: "Set every assumption yourself, see the math update live." },
  { icon: BarChart3, title: "See the results", description: "Your price vs. the market, the reference model, and the community." },
  { icon: RotateCcw, title: "Same quiz again", description: "See what building the model actually taught you." },
  { icon: Share2, title: "Publish", description: "Post your model, or fork someone else's and try your own numbers." },
];

export function JourneyDiagram() {
  return (
    <ol className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        return (
          <li key={step.title} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-xs font-medium tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <p className="text-sm font-semibold">{step.title}</p>
            <p className="text-xs text-muted">{step.description}</p>
          </li>
        );
      })}
    </ol>
  );
}
