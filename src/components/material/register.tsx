"use client";

import { useEffect, useState, type ReactNode } from "react";

export function MaterialRegistry({ children }: { children: ReactNode }) {
  const [, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    void Promise.all([
      import("@material/web/button/filled-button.js"),
      import("@material/web/button/outlined-button.js"),
      import("@material/web/button/text-button.js"),
      import("@material/web/textfield/outlined-text-field.js"),
      import("@material/web/select/outlined-select.js"),
      import("@material/web/select/select-option.js"),
      import("@material/web/chips/filter-chip.js"),
      import("@material/web/progress/linear-progress.js"),
      import("@material/web/dialog/dialog.js"),
      import("@material/web/fab/fab.js"),
      import("@material/web/checkbox/checkbox.js"),
    ])
      .then(() => {
        if (live) setReady(true);
      })
      .catch((err) => {
        console.error("Material Web não carregou", err);
      });
    return () => {
      live = false;
    };
  }, []);
  return <>{children}</>;
}
