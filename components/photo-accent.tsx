export function PhotoAccent({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <figure className={`inline-block ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-44 rounded-lg border border-border object-cover shadow-sm sm:w-52" />
      <figcaption className="mt-1.5 text-xs text-muted">AI-generated illustrative image</figcaption>
    </figure>
  );
}
