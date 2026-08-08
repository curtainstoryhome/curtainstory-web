"use client";

import { useState } from "react";
import AdminButton from "@/components/admin/AdminButton";
import { logout } from "@/app/admin/login/actions";

// Signing out redirects, so the button must show it is working — otherwise the
// page just sits there for a moment and the press looks ignored.
export default function LogoutButton() {
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async () => {
        setPending(true);
        try {
          await logout();
        } finally {
          setPending(false);
        }
      }}
    >
      <AdminButton
        type="submit"
        variant="secondary"
        size="sm"
        pending={pending}
        pendingLabel="กำลังออก..."
      >
        ออกจากระบบ
      </AdminButton>
    </form>
  );
}
