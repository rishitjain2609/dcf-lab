export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-12 pb-8">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {description && <p className="mt-3 max-w-2xl text-muted">{description}</p>}
    </div>
  );
}
