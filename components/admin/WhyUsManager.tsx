"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import AdminButton from "@/components/admin/AdminButton";
import { useRouter } from "next/navigation";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { useToast } from "@/components/admin/Toast";
import type { WhyUsItemRow } from "@/lib/types";

export default function WhyUsManager({
  items,
  onAdd,
  onDelete,
}: {
  items: WhyUsItemRow[];
  onAdd: (formData: FormData) => Promise<string>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [localItems, setLocalItems] = useState(items);
  const router = useRouter();

  // Keeps the on-screen list honest with the database. Holding only a local
  // copy meant a change could succeed on the server while the screen still
  // showed the old list, which reads as "the button did nothing".
  const serverKey = items.map((i) => i.id).join(",");
  const lastServerKey = useRef(serverKey);
  useEffect(() => {
    if (lastServerKey.current !== serverKey) {
      lastServerKey.current = serverKey;
      setLocalItems(items);
    }
  }, [serverKey, items]);
  const [saving, startTransition] = useTransition();
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { notifySuccess, notifyError } = useToast();

  function handleAdd() {
    const value = text.trim();
    if (!value) {
      notifyError("กรุณากรอกข้อความก่อนกดเพิ่ม");
      inputRef.current?.focus();
      return;
    }

    // Show it immediately, then reconcile with the id the server assigns.
    const tempId = `temp-${Date.now()}`;
    setLocalItems((prev) => [
      ...prev,
      { id: tempId, text: value, sort_order: prev.length },
    ]);
    setText("");

    const formData = new FormData();
    formData.set("text", value);

    startTransition(async () => {
      try {
        const realId = await onAdd(formData);
        // Swap the placeholder for the real id — otherwise deleting this row
        // before a page refresh would send "temp-…" to the database.
        setLocalItems((prev) =>
          prev.map((i) => (i.id === tempId ? { ...i, id: realId } : i)),
        );
        notifySuccess("เพิ่มรายการเรียบร้อยแล้ว");
        router.refresh();
      } catch (err) {
        setLocalItems((prev) => prev.filter((i) => i.id !== tempId));
        setText(value); // give the typing back rather than losing it
        notifyError(
          err instanceof Error ? `เพิ่มไม่สำเร็จ: ${err.message}` : "เพิ่มไม่สำเร็จ",
        );
      }
    });
  }

  return (
    <div>
      <ul className="space-y-2">
        {localItems.map((item) => {
          // A row still waiting for its real id cannot be deleted yet.
          const settling = item.id.startsWith("temp-");
          return (
            <li
              key={item.id}
              className={`flex items-center justify-between gap-3 rounded-lg border border-brand-100 bg-white px-4 py-2.5 transition-opacity ${
                settling ? "opacity-60" : ""
              }`}
            >
              <span className="text-sm text-ink">{item.text}</span>
              <ConfirmButton
                title="ลบรายการนี้?"
                message={`"${item.text}" จะถูกลบออกจากหน้าแรกและหน้าเกี่ยวกับเรา การลบไม่สามารถย้อนกลับได้`}
                confirmLabel="ลบรายการ"
                disabled={settling}
                onConfirm={async () => {
                  const snapshot = localItems;
                  setLocalItems((prev) => prev.filter((i) => i.id !== item.id));
                  try {
                    await onDelete(item.id);
                    notifySuccess("ลบรายการเรียบร้อยแล้ว");
                    router.refresh();
                  } catch (err) {
                    setLocalItems(snapshot);
                    notifyError(
                      err instanceof Error
                        ? `ลบไม่สำเร็จ: ${err.message}`
                        : "ลบไม่สำเร็จ กรุณาลองใหม่",
                    );
                  }
                }}
                className="flex-none rounded-full border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {settling ? "กำลังบันทึก..." : "ลบ"}
              </ConfirmButton>
            </li>
          );
        })}
        {localItems.length === 0 && (
          <p className="rounded-lg border border-dashed border-brand-200 px-4 py-6 text-center text-sm text-ink-soft">
            ยังไม่มีรายการ — พิมพ์จุดเด่นของร้านด้านล่างแล้วกดเพิ่ม
          </p>
        )}
      </ul>

      <div className="mt-3 flex gap-2">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          disabled={saving}
          placeholder="เพิ่มจุดเด่น เช่น วัสดุคุณภาพสูง"
          aria-label="ข้อความจุดเด่นที่จะเพิ่ม"
          className="min-h-11 flex-1 rounded-lg border border-brand-200 px-3 py-2 text-sm text-ink transition-colors focus:border-brand-500 focus:outline-none disabled:opacity-60"
        />
        <AdminButton
          type="button"
          onClick={handleAdd}
          pending={saving}
          pendingLabel="กำลังเพิ่ม..."
        >
          เพิ่ม
        </AdminButton>
      </div>
    </div>
  );
}
