import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cookie-free client for public, read-only data. Safe to use in
// generateStaticParams/generateMetadata, which run at build time with no
// request context (no cookies() access available there).
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
