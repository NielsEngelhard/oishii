"use client"

import LanguageFlag from "@/components/ui/LanguageFlag";
import { locales, type Locale } from "@/i18n/config";
import clsx from "clsx";
import { ChevronDown, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import Label from "./Label";

interface Props {
    value: Locale;
    onChange: (locale: Locale) => void;
    label?: string;
    error?: string;
}

export default function LanguageSelectInput({ value, onChange, label, error }: Props) {
    const t = useTranslations("languages");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    const handleSelect = (locale: Locale) => {
        onChange(locale);
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col gap-1" ref={containerRef}>
            {label && (
                <div className="flex gap-1 items-center">
                    <Globe size={14} className="text-muted" />
                    <Label text={label} />
                </div>
            )}

            <div className="relative w-full">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={clsx(
                        "w-full flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2.5 text-base md:text-sm",
                        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        error ? "border-error" : "border-border"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <LanguageFlag locale={value} size="md" />
                        <span>{t(value)}</span>
                    </div>
                    <ChevronDown
                        className={clsx(
                            "h-4 w-4 text-muted transition-transform",
                            isOpen && "rotate-180"
                        )}
                    />
                </button>

                {isOpen && (
                    <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-background shadow-lg">
                        {locales.map((locale) => (
                            <button
                                key={locale}
                                type="button"
                                onClick={() => handleSelect(locale)}
                                className={clsx(
                                    "w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors",
                                    "hover:bg-secondary first:rounded-t-md last:rounded-b-md",
                                    value === locale && "bg-primary/10"
                                )}
                            >
                                <LanguageFlag locale={locale} size="md" />
                                <span>{t(locale)}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {error && <p className="text-sm text-error">{error}</p>}
        </div>
    );
}
