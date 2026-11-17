"use client";

import { useRouter } from "next/navigation";
import { MdTextButton } from "@/components/material/ui";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <MdTextButton
      onClick={() => {
        void authClient.signOut().then(() => {
          router.push("/login");
          router.refresh();
        });
      }}
    >
      Sair
    </MdTextButton>
  );
}
