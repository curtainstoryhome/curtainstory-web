export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";

  return (
    <div className={centered ? "text-center" : "text-left"}>
      {eyebrow && (
        // The hairline rule beside the label is what reads as "studio" rather
        // than "shop" — it costs nothing and sets the tone for the section.
        <p
          className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-700 ${
            centered ? "justify-center" : ""
          }`}
        >
          {centered && <span className="h-px w-8 bg-brand-400/70" />}
          {!centered && <span className="h-px w-7 bg-brand-400/70" />}
          {eyebrow}
          {centered && <span className="h-px w-8 bg-brand-400/70" />}
        </p>
      )}
      <h2 className="mt-3 font-heading text-[26px] font-semibold leading-[1.3] tracking-tight text-ink sm:text-[34px]">
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base ${
            centered ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
