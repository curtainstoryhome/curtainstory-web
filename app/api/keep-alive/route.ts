import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/static";

export const dynamic = "force-dynamic";

// Supabase pauses a free project after a week with no database activity. The
// public pages are prerendered so they would keep serving, but the admin would
// stop working and the next deploy would fail — and the owner would find out
// only when she tried to add a project.
//
// A once-a-day read is enough to keep the project counted as active. The query
// is a bare row count on a table visitors already read, so this endpoint gives
// away nothing and costs nothing if someone else calls it.
export async function GET() {
  try {
    const supabase = createClient();
    const { count, error } = await supabase
      .from("site_settings")
      .select("key", { count: "exact", head: true });

    if (error) {
      // Logged rather than swallowed: a failure here is the early warning that
      // the database is unreachable.
      console.error("[keep-alive] database unreachable", error.message);
      return NextResponse.json(
        { ok: false, error: "database unreachable" },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: true, settings: count ?? 0 });
  } catch (err) {
    console.error("[keep-alive] failed", err);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
