import type { SupabaseClient } from "@supabase/supabase-js";

const STORAGE_PREFIX = "/storage/v1/object/public/site-images/";

function extractStoragePath(imageUrl: string): string | null {
  const idx = imageUrl.indexOf(STORAGE_PREFIX);
  if (idx === -1) return null;
  return imageUrl.slice(idx + STORAGE_PREFIX.length);
}

// Deletes the underlying Storage object for a site-images URL. No-ops for
// local /images/... paths (bundled static files, nothing to clean up).
export async function deleteStorageImage(
  supabase: SupabaseClient,
  imageUrl: string,
) {
  const path = extractStoragePath(imageUrl);
  if (!path) return;
  await supabase.storage.from("site-images").remove([path]);
}

export async function deleteStorageImages(
  supabase: SupabaseClient,
  imageUrls: string[],
) {
  const paths = imageUrls
    .map(extractStoragePath)
    .filter((p): p is string => p !== null);
  if (paths.length === 0) return;
  await supabase.storage.from("site-images").remove(paths);
}
