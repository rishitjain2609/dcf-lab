export function Todo({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-card px-4 py-3 text-sm text-muted">
      <span className="font-mono text-xs uppercase tracking-wide text-accent">TODO(Harsh)</span>
      <p className="mt-1">{children}</p>
    </div>
  );
}
