"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft, FileText, Sparkles, Info } from "lucide-react";
import Button from "@/components/ui/Button";
import TextArea from "@/components/form/TextArea";
import { useState } from "react";

interface TextImportViewProps {
    onBack: () => void;
}

export default function TextImportView({ onBack }: TextImportViewProps) {
    const t = useTranslations("aiImport");
    const [text, setText] = useState("");

    const handleImport = () => {
        // TODO: Implement AI import logic
        console.log("Importing from text:", text);
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold">{t("textImport.title")}</h2>
            </div>

            {/* Text Input */}
            <div className="space-y-4">
                <TextArea
                    placeholder={t("textPlaceholder")}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[200px]"
                />

                <Button
                    text={t("importButton")}
                    Icon={Sparkles}
                    variant="primary"
                    size="lg"
                    onClick={handleImport}
                    disabled={!text.trim()}
                    className="w-full"
                />
            </div>

            {/* Helper text */}
            <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-xl">
                <Info size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted">
                    {t("helperText")}
                </p>
            </div>
        </div>
    );
}
