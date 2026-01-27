"use client";

import { useAuth } from "@/contexts/AuthContext";
import { StickyNote } from "lucide-react";
import { useState } from "react";
import CheatSheetPopup from "./CheatSheetPopup";

/**
 * Floating Action Button for quick access to cheat sheet on mobile.
 * Only shown when user is logged in.
 */
export default function CheatSheetFAB() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-30 md:hidden
                           w-14 h-14 rounded-full shadow-lg
                           bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600
                           flex items-center justify-center
                           transform hover:scale-105 active:scale-95
                           transition-all duration-200 touch-manipulation"
                style={{
                    boxShadow: "0 4px 14px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)"
                }}
                aria-label="Open cheat sheet"
            >
                <StickyNote size={24} className="text-yellow-900" />
            </button>

            {/* Popup */}
            <CheatSheetPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
