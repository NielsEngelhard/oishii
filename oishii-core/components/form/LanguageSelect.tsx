"use client"

import LanguageFlag from "@/components/ui/LanguageFlag";
import { locales, type Locale } from "@/i18n/config";
import { useTranslations } from "next-intl";
import { Check, Globe } from "lucide-react";

interface Props {
  value: Locale;
  onChange: (locale: Locale) => void;
  showLabel?: boolean;
}

export default function LanguageSelect({ value, onChange, showLabel = true }: Props) {
  const t = useTranslations("languages");

  return (
    <div className="flex flex-col gap-1">
      {showLabel && (
        <label className="text-sm font-medium text-muted flex items-center gap-1">
          <Globe size={14} />
          {useTranslations("auth")("language")}
        </label>
      )}
      <div className="flex gap-2">
        {locales.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => onChange(locale)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border-2 ${
              value === locale
                ? "bg-primary/10 text-primary border-primary ring-2 ring-primary/20"
                : "bg-secondary/50 hover:bg-secondary text-muted hover:text-foreground border-transparent"
            }`}
          >
            <LanguageFlag locale={locale} size="sm" />
            {t(locale)}
            {value === locale && <Check size={16} className="ml-1" />}
          </button>
        ))}
      </div>
    </div>
  );
}
