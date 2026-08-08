"use client";

import { useState } from "react";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { useToast } from "@/components/admin/Toast";

export default function DeleteRowButton({
  onDelete,
  itemName,
  kind,
  extraWarning,
}: {
  onDelete: () => Promise<void>;
  itemName: string;
  kind: string;
  extraWarning?: string;
}) {
  const [pending, setPending] = useState(false);
  const { notifySuccess, notifyError } = useToast();

  return (
    <ConfirmButton
      title={`ลบ${kind}นี้?`}
      message={
        extraWarning
          ? `"${itemName}" — ${extraWarning}`
          : `"${itemName}" จะถูกลบออกจากเว็บไซต์ทันที`
      }
      disabled={pending}
      onConfirm={async () => {
        // useTransition's pending flag never went true here because the await
        // happened outside it, so "กำลังลบ..." was never actually shown.
        setPending(true);
        try {
          await onDelete();
          notifySuccess(`ลบ "${itemName}" เรียบร้อยแล้ว`);
        } catch (err) {
          notifyError(
            err instanceof Error
              ? `ลบไม่สำเร็จ: ${err.message}`
              : "ลบไม่สำเร็จ กรุณาลองใหม่",
          );
        } finally {
          setPending(false);
        }
      }}
      className="inline-flex min-h-9 items-center rounded-full border border-red-200 px-4 text-sm font-medium text-red-600 transition-[background-color,transform] hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "กำลังลบ..." : "ลบ"}
    </ConfirmButton>
  );
}
