export function PageHeroBanner({
  src,
  alt,
  tintClassName = "from-black/70 via-black/30 to-transparent",
}: {
  src: string;
  alt: string;
  tintClassName?: string;
}) {
  return (
    <div className="relative h-48 w-full overflow-hidden sm:h-64">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full scale-110 object-cover blur-[2px]" />
      <div className={`absolute inset-0 bg-gradient-to-t ${tintClassName}`} />
      <p className="absolute bottom-2 right-3 text-[10px] text-white/70">AI-generated illustrative image</p>
    </div>
  );
}
