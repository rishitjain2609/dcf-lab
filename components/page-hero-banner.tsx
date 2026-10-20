export function PageHero({
  src,
  alt,
  video,
  title,
  description,
}: {
  src: string;
  alt: string;
  /** Path to an mp4 to use as an autoplaying background instead of the static photo; `src` becomes its poster frame. */
  video?: string;
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
      {/* Neutral scrim so the title stays legible over any photo. */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-12 text-white">
        <h1 className="t-display">{title}</h1>
        {description && <p className="t-body mt-5 max-w-2xl">{description}</p>}
      </div>
    </div>
  );
}
