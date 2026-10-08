export function PageHeader({
  title,
  description,
  accentClassName,
}: {
  title: string;
  description?: string;
  /** e.g. "bg-violet-500", a small colored bar identifying this section. */
  accentClassName?: string;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-12 pb-8">
      {accentClassName && <div className={`mb-4 h-1.5 w-10 rounded-full ${accentClassName}`} />}
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold italic tracking-tight">{title}</h1>
      {description && <p className="mt-3 max-w-2xl text-lg text-muted">{description}</p>}
    </div>
  );
}
