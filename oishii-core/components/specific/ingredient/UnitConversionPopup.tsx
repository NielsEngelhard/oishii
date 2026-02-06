"use client";

import { IngredientUnit } from "@/db/schemas/enum/ingredient-unit";
import { formatAmount, getConversions, getUnitSystem, isConvertibleUnit, UnitConversion } from "@/lib/util/unit-conversion";
import { ArrowRightLeft, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

interface Props {
    unit: IngredientUnit;
    amount: number;
    ingredientName: string;
}

export default function UnitConversionPopup({ unit, amount, ingredientName }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const t = useTranslations("ingredients");
    const tUnits = useTranslations("units");

    const conversions = getConversions(unit, amount);
    const canConvert = isConvertibleUnit(unit) && conversions.length > 0;
    const currentSystem = getUnitSystem(unit);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            // Prevent body scroll on mobile when popup is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const unitLabel = unit !== "none" ? tUnits(unit) : "";

    if (!canConvert) {
        // Non-convertible unit - just display normally
        return (
            <span className="text-muted">
                {formatAmount(amount)} {unitLabel}
            </span>
        );
    }

    const systemLabel = currentSystem === "metric" ? t("metric") : t("usImperial");

    return (
        <>
            {/* Trigger button */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="text-muted hover:text-primary active:text-primary transition-colors flex items-center gap-1 touch-manipulation"
                aria-label={`${t("convert")} ${formatAmount(amount)} ${unitLabel}`}
            >
                <span>{formatAmount(amount)} {unitLabel}</span>
                <ArrowRightLeft size={14} className="opacity-50" />
            </button>

            {/* Backdrop + Popup */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Popup - Bottom sheet on mobile, centered popup on desktop */}
                    <div
                        ref={popupRef}
                        className="fixed z-50 bg-background rounded-t-2xl sm:rounded-2xl shadow-xl border border-border
                                   bottom-0 left-0 right-0 sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
                                   max-h-[70vh] sm:max-h-[80vh] sm:w-80 sm:max-w-[90vw]
                                   animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:fade-in sm:zoom-in-95 duration-300"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <div className="flex flex-col">
                                <span className="font-semibold">{ingredientName}</span>
                                <span className="text-sm text-muted">
                                    {formatAmount(amount)} {unitLabel} ({systemLabel})
                                </span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background-secondary transition-colors touch-manipulation"
                                aria-label={t("close")}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Conversions list */}
                        <div className="p-4 space-y-2 overflow-y-auto">
                            <p className="text-xs text-muted uppercase tracking-wide mb-3">
                                {t("alternativeUnits")}
                            </p>
                            {conversions.map((conversion, index) => (
                                <ConversionRow key={index} conversion={conversion} t={t} tUnits={tUnits} />
                            ))}
                        </div>

                        {/* Safe area padding for mobile */}
                        <div className="h-safe-area-inset-bottom sm:hidden" />
                    </div>
                </>
            )}
        </>
    );
}

interface ConversionRowProps {
    conversion: UnitConversion;
    t: ReturnType<typeof useTranslations<"ingredients">>;
    tUnits: ReturnType<typeof useTranslations<"units">>;
}

function ConversionRow({ conversion, t, tUnits }: ConversionRowProps) {
    const systemBadge = conversion.system === "metric" ? t("metric") : t("usImperial");
    const unitLabel = tUnits(conversion.unit);
    const badgeColor = conversion.system === "metric"
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
        : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";

    return (
        <div className="flex items-center justify-between p-3 bg-background-secondary rounded-xl">
            <div className="flex items-center gap-2">
                <span className="text-lg font-medium">
                    {formatAmount(conversion.amount)}
                </span>
                <span className="text-muted">
                    {unitLabel}
                </span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColor}`}>
                {systemBadge}
            </span>
        </div>
    );
}
