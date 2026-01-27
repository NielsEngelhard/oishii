"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft, Link2, Sparkles, Info } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/form/Input";
import { useState } from "react";

interface UrlImportViewProps {
    onBack: () => void;
}

export default function UrlImportView({ onBack }: UrlImportViewProps) {
    const t = useTranslations("aiImport");
    const [url, setUrl] = useState("");

    const handleImport = () => {
        // TODO: Implement AI import logic
        console.log("Importing from URL:", url);
    };

    return (
        <div className="space-y-6">
            {/* Back button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
            >
                <ArrowLeft size={18} />
                <span>{t("back")}</span>
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Link2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold">{t("urlImport.title")}</h2>
            </div>

            {/* URL Input */}
            <div className="space-y-4">
                <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted pointer-events-none" />
                    <Input
                        type="url"
                        placeholder={t("urlPlaceholder")}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="pl-11"
                    />
                </div>

                <Button
                    text={t("importButton")}
                    Icon={Sparkles}
                    variant="primary"
                    size="lg"
                    onClick={handleImport}
                    disabled={!url.trim()}
                    className="w-full"
                />
            </div>

            {/* Helper text */}
            <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-xl">
                <Info size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted">
                    {t("helperUrl")}
                </p>
            </div>
        </div>
    );
}
