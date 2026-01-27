"use client";

import { Check, X, AlertCircle } from "lucide-react";
import clsx from "clsx";

interface Props {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: Props) {
  return (
    <div
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl shadow-warm-lg",
        "bg-card border border-border/40",
        "animate-in slide-in-from-bottom-4 fade-in duration-200"
      )}
    >
      <div
        className={clsx(
          "flex items-center justify-center w-6 h-6 rounded-full",
          type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
        )}
      >
        {type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
      </div>
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-muted hover:text-foreground transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
