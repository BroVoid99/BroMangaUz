import { gradientForSeed, initialsForTitle } from "@/lib/covers";

export default function MangaCover({
  seed,
  title,
  className = ""
}: {
  seed: string;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={`torn-edge relative flex aspect-[2/3] items-center justify-center overflow-hidden ${className}`}
      style={{ background: gradientForSeed(seed) }}
    >
      <span className="font-display text-5xl tracking-wide text-parchment/25">
        {initialsForTitle(title)}
      </span>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent" />
    </div>
  );
}
