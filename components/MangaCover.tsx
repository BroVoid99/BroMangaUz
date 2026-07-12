import Image from "next/image";

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
      className={`relative aspect-[2/3] overflow-hidden rounded-md ${className}`}
    >
      <Image
        src={`/covers/${seed}.webp`}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 hover:scale-105"
        sizes="300px"
      />
    </div>
  );
}