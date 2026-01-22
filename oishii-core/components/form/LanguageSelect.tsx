"use client"

import LanguageFlag from "@/components/ui/LanguageFlag";
import { locales, type Locale } from "@/i18n/config";
import { useTranslations } from "next-intl";
import { Globe } from "lucide-react";

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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              value === locale
                ? "bg-primary text-white"
                : "bg-secondary hover:bg-secondary/80 text-foreground"
            }`}
          >
            <LanguageFlag locale={locale} size="sm" />
            {t(locale)}
          </button>
        ))}
      </div>
    </div>
  );
}
