export function PageHero({
  src,
  alt,
  kicker,
  kickerClassName = "text-violet-300",
  title,
  description,
}: {
  src: string;
  alt: string;
  kicker: string;
  kickerClassName?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="relative flex h-80 w-full items-end overflow-hidden sm:h-96">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full scale-110 object-cover blur-[1px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/10" />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-10">
        <p className={`font-mono text-sm font-medium tracking-wide ${kickerClassName}`}>{kicker}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm text-white/85 drop-shadow-sm sm:text-base">{description}</p>
        )}
      </div>
      <p className="absolute bottom-2 right-3 z-10 text-[10px] text-white/50">AI-generated illustrative image</p>
    </div>
  );
}
