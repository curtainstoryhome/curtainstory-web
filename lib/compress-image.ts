// Client-side image compression before upload.
//
// Phone photos are routinely 3-6MB. Storing them raw burns through limited
// storage fast, so they are downscaled and re-encoded on the way in.
//
// The ceiling is 2400px rather than the 1600px used originally. What is stored
// here is the master copy: Next.js generates every display size from it, so a
// visitor never downloads this file — they get a version cut to their screen.
// A 1600px master was the reason the full-screen viewer looked soft, because
// the viewer shows photos up to 1400px wide and a retina screen wants roughly
// double that. Raising the master costs storage only, never page weight.
const MAX_DIMENSION = 2400;
const QUALITY = 0.86;

export type CompressResult = {
  blob: Blob;
  ext: string;
  originalBytes: number;
  compressedBytes: number;
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("อ่านไฟล์รูปไม่สำเร็จ"));
    };
    img.src = url;
  });
}

function canEncodeWebp(): boolean {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").startsWith("data:image/webp");
}

export async function compressImage(file: File): Promise<CompressResult> {
  const img = await loadImage(file);

  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight),
  );
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    // No canvas support: fall back to the original file rather than failing.
    return {
      blob: file,
      ext: file.name.split(".").pop() || "jpg",
      originalBytes: file.size,
      compressedBytes: file.size,
    };
  }

  ctx.drawImage(img, 0, 0, width, height);

  const useWebp = canEncodeWebp();
  const mime = useWebp ? "image/webp" : "image/jpeg";
  const ext = useWebp ? "webp" : "jpg";

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, mime, QUALITY),
  );

  // If encoding failed, or somehow produced a bigger file than the original,
  // keep the original — compression should never make things worse.
  if (!blob || blob.size >= file.size) {
    return {
      blob: file,
      ext: file.name.split(".").pop() || "jpg",
      originalBytes: file.size,
      compressedBytes: file.size,
    };
  }

  return {
    blob,
    ext,
    originalBytes: file.size,
    compressedBytes: blob.size,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
