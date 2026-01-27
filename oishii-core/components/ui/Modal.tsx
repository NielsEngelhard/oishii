"use client";

import { X } from "lucide-react";
import { useEffect, useCallback, ReactNode } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: Props) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal */}
      <div
        className={clsx(
          "relative bg-background rounded-2xl shadow-warm-xl border border-border/40",
          "w-full max-w-sm",
          "animate-in zoom-in-95 fade-in duration-200"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-secondary/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className={clsx(!title && "pt-4", "p-4")}>{children}</div>
      </div>
    </div>,
    document.body
  );
}
