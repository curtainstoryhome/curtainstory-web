import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Answers the first step of a LINE conversation so a lead does not go cold.
//
// The shop replies by hand, and the chat history showed what that costs: a
// "ขอประเมินราคาค่ะ" from 30 Aug was read and never answered. People who add
// the account after an ad tap and get silence for an hour are gone. The
// account's response settings stay on manual chat; this covers the three
// moments where a fixed answer is better than no answer:
//
//   - someone adds the account, and gets buttons to say what they want
//   - an opening question about price or a product
//   - a photo of a window
//
// Anything else is left to the owner. Replying to every message would talk
// over her mid-conversation, which is worse than the gap it fixes, so each
// follower also gets at most one automatic answer every six hours.

type LineEvent = {
  type: string;
  replyToken?: string;
  source?: { userId?: string };
  message?: { type: string; text?: string };
};

type QuickReply = {
  items: Array<{ type: "action"; action: Record<string, string> }>;
};

type PlannedMessage = { text: string; quickReply?: QuickReply };

const REPLY_URL = "https://api.line.me/v2/bot/message/reply";

const PHONE = "098-910-4978";

const QUICK_REPLY: QuickReply = {
  items: [
    { type: "action", action: { type: "message", label: "ห้องคอนโด", text: "สนใจผ้าม่านห้องคอนโดค่ะ" } },
    { type: "action", action: { type: "message", label: "บ้าน", text: "สนใจผ้าม่านบ้านค่ะ" } },
    { type: "action", action: { type: "message", label: "วอลล์เปเปอร์", text: "สนใจวอลล์เปเปอร์ค่ะ" } },
    { type: "action", action: { type: "camera", label: "ถ่ายรูปหน้าต่าง" } },
    { type: "action", action: { type: "cameraRoll", label: "ส่งรูปจากเครื่อง" } },
  ],
};

// Sits after the account's own greeting rather than repeating it: one line,
// then the buttons, so a new follower can say what they want with one tap
// instead of composing a message.
const welcomeText = [
  "กดเลือกด้านล่างได้เลยค่ะ เดี๋ยวประเมินราคาให้ภายในวันนี้",
  "หรือส่งรูปหน้าต่างมาก็ได้ค่ะ",
].join("\n");

const interestReply = (text: string) => {
  const subject = /วอลล์เปเปอร์|วอลเปเปอร์/.test(text)
    ? "วอลล์เปเปอร์"
    : /มู่ลี่|ม่านม้วน/.test(text)
      ? "มู่ลี่หรือม่านม้วน"
      : /คอนโด/.test(text)
        ? "ผ้าม่านห้องคอนโด"
        : /ผ้าม่าน|ม่าน/.test(text)
          ? "ผ้าม่าน"
          : null;
  return [
    subject ? `รับเรื่อง${subject}แล้วค่ะ` : "รับเรื่องแล้วค่ะ",
    "",
    "รบกวน 2 อย่างเพื่อประเมินราคาให้ภายในวันนี้ค่ะ",
    "1. ส่งรูปหน้าต่างหรือห้องมาได้เลย",
    "2. บอกเขตหรือชื่อโครงการ",
    "",
    "ถ้าสะดวกให้ช่างเข้าไปวัดหน้างานฟรี แจ้งวันที่สะดวกได้เลยค่ะ",
    `หรือโทร ${PHONE}`,
  ].join("\n");
};

const photoReply = [
  "ได้รับรูปแล้วค่ะ ขอบคุณค่ะ",
  "",
  "ขอทราบเขตหรือชื่อโครงการ และขนาดกว้าง x สูงคร่าวๆ ของหน้าต่างค่ะ",
  "ถ้าไม่ทราบขนาด ช่างเข้าไปวัดให้ฟรี แจ้งวันที่สะดวกได้เลยค่ะ",
  "",
  "เดี๋ยวแจ้งราคาให้ภายในวันนี้ค่ะ",
].join("\n");

// Someone opening a conversation, not someone in the middle of one: a price
// or product question. "ขอประเมินราคาค่ะ" and "ผ้าม่านคอนโดเท่าไหร่" match;
// "พรุ่งนี้บ่ายสองได้ไหมคะ" does not.
const OPENING_QUESTION =
  /สนใจ|ราคา|ประเมิน|เท่าไห?ร่|เท่าไร|กี่บาท|สอบถาม|ผ้าม่าน|วอลล์?เปเปอร์|มู่ลี่|ม่านม้วน|ฉากกั้น/;

export function plan(event: LineEvent): PlannedMessage | null {
  if (!event.replyToken) return null;
  if (event.type === "follow") {
    return { text: welcomeText, quickReply: QUICK_REPLY };
  }
  if (event.type !== "message" || !event.message) return null;
  const { type, text } = event.message;
  if (type === "image") return { text: photoReply };
  if (type === "text" && text && OPENING_QUESTION.test(text)) {
    return { text: interestReply(text) };
  }
  return null;
}

// Warm instances keep this between requests, which is all it needs to do: stop
// the same person being answered twice while the shop is talking to them. A
// cold start loses it, and the worst case is one extra message.
const lastAnswered = new Map<string, number>();
const COOLDOWN_MS = 6 * 60 * 60 * 1000;

function withinCooldown(userId: string | undefined, now: number) {
  if (!userId) return false;
  const previous = lastAnswered.get(userId);
  if (previous && now - previous < COOLDOWN_MS) return true;
  lastAnswered.set(userId, now);
  if (lastAnswered.size > 500) {
    for (const [id, at] of lastAnswered) {
      if (now - at >= COOLDOWN_MS) lastAnswered.delete(id);
    }
  }
  return false;
}

function signatureMatches(body: string, header: string | null, secret: string) {
  if (!header) return false;
  const expected = createHmac("sha256", secret).update(body).digest();
  let given: Buffer;
  try {
    given = Buffer.from(header, "base64");
  } catch {
    return false;
  }
  return given.length === expected.length && timingSafeEqual(given, expected);
}

// Lets the deploy be checked without exposing anything: whether the two
// secrets reached the server is the one thing that cannot be read from the
// repository.
export async function GET() {
  const configured = Boolean(
    process.env.LINE_CHANNEL_SECRET && process.env.LINE_CHANNEL_ACCESS_TOKEN,
  );
  return NextResponse.json({ ok: true, configured });
}

export async function POST(request: Request) {
  const secret = process.env.LINE_CHANNEL_SECRET;
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!secret || !token) {
    console.error("[line-webhook] LINE_CHANNEL_SECRET or LINE_CHANNEL_ACCESS_TOKEN missing");
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const body = await request.text();
  if (!signatureMatches(body, request.headers.get("x-line-signature"), secret)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let events: LineEvent[] = [];
  try {
    events = (JSON.parse(body) as { events?: LineEvent[] }).events ?? [];
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // LINE retries on anything but a 2xx, and a retry would send the same
  // greeting twice. Reply failures are logged, never surfaced.
  const now = Date.now();
  await Promise.all(
    events.map(async (event) => {
      const message = plan(event);
      if (!message) return;
      if (withinCooldown(event.source?.userId, now)) return;
      try {
        const res = await fetch(REPLY_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            replyToken: event.replyToken,
            messages: [{ type: "text", ...message }],
          }),
        });
        if (!res.ok) {
          console.error("[line-webhook] reply failed", res.status, await res.text());
        }
      } catch (err) {
        console.error("[line-webhook] reply failed", err);
      }
    }),
  );

  return NextResponse.json({ ok: true });
}
