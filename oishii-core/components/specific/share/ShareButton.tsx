"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import ShareModal from "./ShareModal";
import clsx from "clsx";

interface Props {
  recipeId: string;
  recipeTitle: string;
  variant?: "card" | "detail";
}

export default function ShareButton({ recipeId, recipeTitle, variant = "card" }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={clsx(
          "transition-all duration-200",
          "hover:scale-110 active:scale-95",
          variant === "card" && [
            "p-2 rounded-full",
            "bg-background/80 backdrop-blur-sm hover:bg-background",
          ],
          variant === "detail" && [
            "p-2 rounded-full",
            "bg-background/80 hover:bg-background",
          ]
        )}
      >
        <Share2
          size={variant === "card" ? 18 : 20}
          className="text-muted hover:text-foreground transition-colors"
        />
      </button>
      <ShareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        recipeId={recipeId}
        recipeTitle={recipeTitle}
      />
    </>
  );
}
