"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/material/icon";

export type AjusteCard = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  content: ReactNode;
  danger?: boolean;
};

export function AjustesCards({ cards }: { cards: AjusteCard[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="settings">
      {cards.map((card) => {
        const open = openId === card.id;
        return (
          <article key={card.id} className={open ? "set open" : "set"}>
            <button
              type="button"
              className="set-hit"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : card.id)}
            >
              <span className={card.danger ? "set-ico danger" : "set-ico"}>
                <Icon name={card.icon} />
              </span>
              <span className="set-copy">
                <b>{card.title}</b>
                <p>{card.subtitle}</p>
              </span>
              <Icon name={open ? "expand_less" : "expand_more"} />
            </button>
            {open ? <div className={card.danger ? "set-body danger" : "set-body"}>{card.content}</div> : null}
          </article>
        );
      })}
    </div>
  );
}
