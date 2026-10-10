"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Accessible side drawer built on the native <dialog> element.
 * showModal() makes the rest of the page inert (focus stays inside), Escape closes it,
 * focus returns to the opener on close, and the page behind is scroll-locked.
 */
export default function Drawer({
  open,
  onClose,
  title,
  side = "right",
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "left" | "right";
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add("scroll-locked");
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      document.documentElement.classList.remove("scroll-locked");
      onClose();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  useEffect(() => () => document.documentElement.classList.remove("scroll-locked"), []);

  const position = side === "right" ? "ml-auto animate-slide-in-right" : "mr-auto animate-slide-in-left";

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={`drawer m-0 h-full max-h-none w-[min(26rem,100vw)] max-w-none bg-hb-bone p-0 text-hb-ink shadow-drawer ${position}`}
      onClick={(e) => {
        // Clicking the backdrop (the dialog element itself, outside the panel) closes it.
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-hb-ink/10 px-5 py-4">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-hb-ink/5"
            aria-label="Close"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
        {footer && <div className="border-t border-hb-ink/10 bg-white px-5 py-4">{footer}</div>}
      </div>
    </dialog>
  );
}
