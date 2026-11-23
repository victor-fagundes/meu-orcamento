"use client";

import { MdTextButton } from "@/components/material/ui";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  return (
    <MdTextButton
      onClick={() => {
        void authClient.signOut().then(() => {
          window.location.assign("/login");
        });
      }}
    >
      Sair
    </MdTextButton>
  );
}
