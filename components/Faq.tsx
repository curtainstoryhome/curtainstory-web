// The questions people ask in chat before they ask for a quote. Answering them
// on the page does two jobs: it saves the shop from typing the same reply all
// day, and it is the one content shape Google still gives extra room to in
// search results.
//
// A question whose answer is blank is skipped entirely — the shop has not
// decided its wording yet, and a heading with nothing under it is worse than
// no heading. That is also why price, lead time and warranty ship empty.
export default function Faq({
  items,
  siteUrl,
}: {
  items: { question: string; answer: string }[];
  siteUrl: string;
}) {
  const answered = items.filter(
    (item) => item.question.trim() && item.answer.trim(),
  );
  if (answered.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteUrl}/contact#faq`,
    mainEntity: answered.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Our own content, not user-supplied HTML.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="divide-y divide-brand-100 overflow-hidden rounded-2xl border border-brand-100 bg-white">
        {answered.map((item, index) => (
          // <details> rather than a scripted accordion: it opens even if the
          // JavaScript has not arrived, and the browser gives it keyboard
          // handling and screen-reader semantics for free.
          <details key={index} className="group">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-ink transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-700">
              {item.question}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="h-5 w-5 flex-none text-brand-700 transition-transform duration-200 group-open:rotate-45"
              >
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </summary>
            <p className="px-5 pb-5 leading-relaxed text-ink-soft">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </>
  );
}
