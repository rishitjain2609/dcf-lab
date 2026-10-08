export function PageHero({
  src,
  alt,
  video,
  kicker,
  kickerClassName = "text-violet-300",
  title,
  description,
}: {
  src: string;
  alt: string;
  /** Path to an mp4 to use as an autoplaying background instead of the static photo; `src` becomes its poster frame. */
  video?: string;
  kicker: string;
  kickerClassName?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="relative flex h-[26rem] w-full items-end overflow-hidden sm:h-[32rem]">
      {video ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={src}
          className="absolute inset-0 h-full w-full scale-110 object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full scale-110 object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-12">
        <p className={`font-mono text-base font-medium tracking-wide ${kickerClassName}`}>{kicker}</p>
        <h1
          className={`mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold italic tracking-tight drop-shadow-sm sm:text-7xl ${kickerClassName}`}
        >
          {title}
        </h1>
        {description && (
          <p className={`mt-4 max-w-2xl text-lg drop-shadow-sm sm:text-xl ${kickerClassName}`}>{description}</p>
        )}
      </div>
    </div>
  );
}
