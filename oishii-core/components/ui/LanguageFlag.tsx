import { Locale } from "@/i18n/config";
import GB from "country-flag-icons/react/3x2/GB";
import NL from "country-flag-icons/react/3x2/NL";
import DE from "country-flag-icons/react/3x2/DE";
import ES from "country-flag-icons/react/3x2/ES";
import FR from "country-flag-icons/react/3x2/FR";

// Map locale codes to country flag components
const flagComponents: Record<Locale, React.ComponentType<{ className?: string }>> = {
    en: GB,
    nl: NL,
    de: DE,
    es: ES,
    fr: FR,
};

interface Props {
    locale: Locale;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizeClasses = {
    sm: "w-4 h-3",
    md: "w-5 h-4",
    lg: "w-6 h-4",
};

export default function LanguageFlag({ locale, size = "md", className = "" }: Props) {
    const FlagComponent = flagComponents[locale];

    if (!FlagComponent) {
        return null;
    }

    return (
        <FlagComponent
            className={`${sizeClasses[size]} rounded-sm ${className}`}
        />
    );
}
