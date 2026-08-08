import { ChatIcon, PhoneIcon } from "@/components/icons";
import type { BusinessInfo } from "@/lib/types";

type ButtonProps = { business: BusinessInfo; className?: string };

// These two are the most-tapped things on the whole site and they used to do
// nothing at all when pressed — no dip, no focus ring. On a phone, tapping and
// seeing nothing move reads as "the button is broken", and people tap again.
// The dip is instant and physical; the ring is for keyboard users.
const PRESS =
  "transition-[background-color,opacity,transform,box-shadow] duration-150 " +
  "active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2";

export function CallButton({ business, className = "" }: ButtonProps) {
  return (
    <a
      href={business.phone_href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-brand-500 px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50 focus-visible:outline-brand-700 ${PRESS} ${className}`}
    >
      <PhoneIcon className="h-4 w-4" />
      โทร {business.phone}
    </a>
  );
}

export function LineButton({ business, className = "" }: ButtonProps) {
  return (
    <a
      href={business.line_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-line px-6 py-3 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline-line ${PRESS} ${className}`}
    >
      <ChatIcon className="h-4 w-4" />
      แชทกับเราทาง LINE
    </a>
  );
}

export function CtaGroup({ business, className = "" }: ButtonProps) {
  return (
    // data-cta-block is how the floating buttons know to get out of the way.
    // Whenever a real pair of buttons like this one is on screen, the floating
    // pair hides, so the same two actions are never offered twice at once.
    <div
      data-cta-block
      className={`flex flex-wrap items-center gap-3 ${className}`}
    >
      <LineButton business={business} />
      <CallButton business={business} />
    </div>
  );
}
