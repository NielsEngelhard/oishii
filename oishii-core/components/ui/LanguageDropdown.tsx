"use client";

import { Locale, locales } from "@/i18n/config";
import { getLanguageCookie, setLanguageCookie } from "@/lib/i18n/language";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import LanguageFlag from "./LanguageFlag";

export default function LanguageDropdown() {
    const t = useTranslations("languages");
    const [isOpen, setIsOpen] = useState(false);
    const [currentLocale, setCurrentLocale] = useState<Locale>("en");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCurrentLocale(getLanguageCookie());
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (locale: Locale) => {
        setLanguageCookie(locale);
        setCurrentLocale(locale);
        setIsOpen(false);
        // Reload to apply the new language
        window.location.reload();
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary/60 transition-colors"
            >
                <LanguageFlag locale={currentLocale} size="md" />
                <ChevronDown className={`w-4 h-4 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-warm-lg overflow-hidden z-[100] min-w-[140px]">
                    {locales.map((locale) => (
                        <button
                            key={locale}
                            onClick={() => handleSelect(locale)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/50 transition-colors ${
                                currentLocale === locale ? "bg-primary/10 text-primary" : ""
                            }`}
                        >
                            <LanguageFlag locale={locale} size="md" />
                            <span className="font-medium">{t(locale)}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
