"use client";

import { DEFAULT_CHEAT_SHEET } from "@/db/schemas/users";
import { StickyNote, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CheatSheetPopup({ isOpen, onClose }: Props) {
    const [content, setContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const t = useTranslations("cheatSheet");

    const fetchCheatSheet = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/user/cheat-sheet");
            if (response.ok) {
                const data = await response.json();
                setContent(data.cheatSheet);
            } else {
                setContent(DEFAULT_CHEAT_SHEET);
            }
        } catch {
            setContent(DEFAULT_CHEAT_SHEET);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen && content === null) {
            fetchCheatSheet();
        }
    }, [isOpen, content, fetchCheatSheet]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const lines = (content || "").split("\n").filter(line => line.trim());

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-50 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Post-it Card */}
            <div
                className="fixed z-50
                           bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-4 sm:top-20
                           animate-in slide-in-from-bottom sm:slide-in-from-top-2 sm:fade-in duration-300"
            >
                <div className="relative mx-auto sm:mx-0 max-w-sm w-full">
                    {/* Post-it Note Design */}
                    <div
                        className="bg-yellow-200 dark:bg-yellow-300 rounded-t-xl sm:rounded-xl shadow-xl
                                   transform sm:rotate-1 sm:hover:rotate-0 transition-transform duration-300"
                        style={{
                            boxShadow: "4px 4px 15px rgba(0,0,0,0.2), inset 0 -2px 10px rgba(0,0,0,0.05)"
                        }}
                    >
                        {/* Tape effect (desktop only) */}
                        <div className="hidden sm:block absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-yellow-100/80 dark:bg-yellow-200/80 rounded-sm rotate-0 shadow-sm" />

                        {/* Header */}
                        <div className="flex items-center justify-between p-4 pb-2">
                            <div className="flex items-center gap-2">
                                <StickyNote size={20} className="text-yellow-700 dark:text-yellow-800" />
                                <h3 className="font-handwriting text-lg font-bold text-yellow-900 dark:text-yellow-950">
                                    {t("title")}
                                </h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-full hover:bg-yellow-300 dark:hover:bg-yellow-400 transition-colors touch-manipulation"
                                aria-label={t("close")}
                            >
                                <X size={18} className="text-yellow-700 dark:text-yellow-800" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-4 pb-4 pt-2">
                            {isLoading ? (
                                <div className="space-y-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-5 bg-yellow-300/50 dark:bg-yellow-400/50 rounded animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <ul className="space-y-2">
                                    {lines.map((line, index) => (
                                        <li
                                            key={index}
                                            className="text-yellow-900 dark:text-yellow-950 font-medium text-sm leading-relaxed flex items-start gap-2"
                                        >
                                            <span className="text-yellow-600 dark:text-yellow-700 mt-0.5">•</span>
                                            <span>{line}</span>
                                        </li>
                                    ))}
                                    {lines.length === 0 && (
                                        <li className="text-yellow-700 dark:text-yellow-800 text-sm italic">
                                            {t("empty")}
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>

                        {/* Footer hint */}
                        <div className="px-4 pb-3 pt-1 border-t border-yellow-300 dark:border-yellow-400">
                            <p className="text-xs text-yellow-700 dark:text-yellow-800 text-center">
                                {t("editHint")}
                            </p>
                        </div>
                    </div>

                    {/* Safe area for mobile */}
                    <div className="h-safe-area-inset-bottom bg-yellow-200 dark:bg-yellow-300 sm:hidden" />
                </div>
            </div>
        </>
    );
}
