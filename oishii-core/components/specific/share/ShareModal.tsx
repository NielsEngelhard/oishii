"use client";

import Modal from "@/components/ui/Modal";
import { useToast } from "@/contexts/ToastContext";
import { Link, MessageCircle, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

interface ShareOption {
  id: string;
  icon: LucideIcon;
  labelKey: string;
  action: () => void;
  className?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  recipeId: string;
  recipeTitle: string;
}

export default function ShareModal({ isOpen, onClose, recipeId, recipeTitle }: Props) {
  const t = useTranslations("share");
  const { showToast } = useToast();

  const getRecipeUrl = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/recipe/${recipeId}`;
  };

  const handleCopyLink = async () => {
    const url = getRecipeUrl();
    try {
      await navigator.clipboard.writeText(url);
      showToast(t("linkCopied"), "success");
      onClose();
    } catch {
      showToast("Failed to copy link", "error");
    }
  };

  const handleWhatsApp = () => {
    const url = getRecipeUrl();
    const message = `${recipeTitle} - ${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  const shareOptions: ShareOption[] = [
    {
      id: "copy",
      icon: Link,
      labelKey: "copyLink",
      action: handleCopyLink,
    },
    {
      id: "whatsapp",
      icon: MessageCircle,
      labelKey: "shareViaWhatsApp",
      action: handleWhatsApp,
      className: "hover:bg-green-50 hover:text-green-600 hover:border-green-200",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("shareRecipe")}>
      <div className="flex flex-col gap-2">
        {shareOptions.map((option) => (
          <button
            key={option.id}
            onClick={option.action}
            className={clsx(
              "flex items-center gap-3 w-full p-3 rounded-xl",
              "border border-border",
              "transition-all duration-200",
              "hover:bg-secondary/20",
              option.className
            )}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary/30">
              <option.icon size={20} />
            </div>
            <span className="font-medium">{t(option.labelKey as "copyLink" | "shareViaWhatsApp")}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
