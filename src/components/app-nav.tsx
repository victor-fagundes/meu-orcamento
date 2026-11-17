"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/material/icon";

const ITEMS = [
  { href: "/app/resumo", label: "Resumo", icon: "home" },
  { href: "/app/orcamento", label: "Orçamento", icon: "wallet" },
  { href: "/app/lancamentos", label: "Lançamentos", icon: "list" },
  { href: "/app/ano", label: "Ano", icon: "calendar" },
  { href: "/app/ajustes", label: "Ajustes", icon: "settings" },
] as const;

export function AppNav() {
  const pathname = usePathname();
  return (
    <>
      <nav className="app-nav-desktop" aria-label="Principal">
        {ITEMS.map((item) => {
          const on = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={on ? "app-nav-link on" : "app-nav-link"}>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <nav className="app-nav-mobile" aria-label="Principal">
        {ITEMS.map((item) => {
          const on = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={on ? "app-nav-m-item on" : "app-nav-m-item"}>
              <span className="app-nav-pill">
                <Icon name={item.icon} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
