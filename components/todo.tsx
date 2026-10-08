export function Todo({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative -rotate-1 rounded-2xl bg-amber-50 px-5 py-4 shadow-sm dark:bg-amber-950/30">
      <div className="absolute -top-2 left-5 h-4 w-4 rotate-45 bg-amber-200 dark:bg-amber-900" />
      <span className="font-[family-name:var(--font-display)] text-sm font-semibold italic text-amber-800 dark:text-amber-300">
        TODO(Rishit)
      </span>
      <p className="mt-1 text-sm text-amber-900/80 dark:text-amber-100/70">{children}</p>
    </div>
  );
}
