import Image from "next/image";

type ColumnConfig = {
  direction: "up" | "down";
  durationSeconds: number;
};

const columnConfigs: ColumnConfig[] = [
  { direction: "up", durationSeconds: 26 },
  { direction: "down", durationSeconds: 32 },
  { direction: "up", durationSeconds: 29 },
];

function rotate<T>(items: T[], offset: number): T[] {
  if (items.length === 0) return items;
  const shift = offset % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

function MarqueeColumn({
  images,
  direction,
  durationSeconds,
}: ColumnConfig & { images: string[] }) {
  const loop = [...images, ...images];
  return (
    <div className="relative h-[520px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      <div
        className={`flex flex-col gap-4 ${direction === "up" ? "animate-marquee-up" : "animate-marquee-down"}`}
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {loop.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-brand-100 shadow-sm"
          >
            <Image
              src={src}
              alt="ข้อความจากลูกค้าจริงทาง LINE"
              fill
              sizes="(min-width: 1024px) 20vw, 33vw"
              className="object-cover"
            
          quality={90}
        />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReviewMarquee({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {columnConfigs.map((config, i) => (
        <div key={i} className={i === 2 ? "hidden sm:block" : ""}>
          <MarqueeColumn images={rotate(images, i)} {...config} />
        </div>
      ))}
    </div>
  );
}
