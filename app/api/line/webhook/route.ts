import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Answers the first step of a LINE conversation so a lead does not go cold.
//
// The shop replies by hand, and the chat history showed what that costs: a
// "ขอประเมินราคาค่ะ" from 30 Aug was read and never answered. People who add
// the account after an ad tap and get silence for an hour are gone. The
// account's response settings stay on manual chat; this only covers the two
// moments where a fixed answer is better than no answer:
//
//   - a quick-reply tap from the follow-up message ("สนใจผ้าม่านบ้านค่ะ")
//   - a photo of a window
//
// Anything else is left to the owner. Replying to every message would talk
// over her mid-conversation, which is worse than the gap it fixes.

type LineEvent = {
  type: string;
  replyToken?: string;
  message?: { type: string; text?: string };
};

const REPLY_URL = "https://api.line.me/v2/bot/message/reply";

const PHONE = "098-910-4978";

const interestReply = (text: string) => {
  const subject = /วอลล์เปเปอร์|วอลเปเปอร์/.test(text)
    ? "วอลล์เปเปอร์"
    : /มู่ลี่|ม่านม้วน/.test(text)
      ? "มู่ลี่หรือม่านม้วน"
      : /คอนโด/.test(text)
        ? "ผ้าม่านห้องคอนโด"
        : "ผ้าม่านบ้าน";
  return [
    `รับเรื่อง${subject}แล้วค่ะ`,
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

function replyFor(event: LineEvent): string | null {
  if (event.type !== "message" || !event.replyToken || !event.message) {
    return null;
  }
  const { type, text } = event.message;
  if (type === "image") return photoReply;
  if (type === "text" && text && /^สนใจ/.test(text.trim())) {
    return interestReply(text);
  }
  return null;
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
  await Promise.all(
    events.map(async (event) => {
      const text = replyFor(event);
      if (!text) return;
      try {
        const res = await fetch(REPLY_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            replyToken: event.replyToken,
            messages: [{ type: "text", text }],
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
