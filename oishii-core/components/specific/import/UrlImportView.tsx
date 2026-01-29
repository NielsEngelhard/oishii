"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ArrowLeft, Link2, Sparkles, Info, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/form/Input";
import CookingLoader from "@/components/ui/CookingLoader";
import { CREATE_RECIPE_ROUTE } from "@/app/routes";

interface UrlImportViewProps {
    onBack: () => void;
}

export default function UrlImportView({ onBack }: UrlImportViewProps) {
    const t = useTranslations("aiImport");
    const router = useRouter();
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImport = async () => {
        if (!url.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/recipe/scrape", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || t("scrapeError"));
                setIsLoading(false);
                return;
            }
            
            // TODO: this can be saved on session!
            // Store the scraped recipe in sessionStorage for the create page to pick up
            sessionStorage.setItem("importedRecipe", JSON.stringify(data.recipe));

            // Redirect to create page
            router.push(CREATE_RECIPE_ROUTE);
        } catch {
            setError(t("scrapeError"));
            setIsLoading(false);
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="space-y-6">
                {/* Back button (disabled during loading) */}
                <button
                    disabled
                    className="flex items-center gap-2 text-muted/50 cursor-not-allowed"
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

                {/* Loading animation */}
                <CookingLoader size="lg" />
            </div>
        );
    }

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

            {/* Error message */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-error shrink-0" />
                    <p className="text-sm text-error">{error}</p>
                </div>
            )}

            {/* URL Input */}
            <div className="space-y-4">
                <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted pointer-events-none" />
                    <Input
                        type="url"
                        placeholder={t("urlPlaceholder")}
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            if (error) setError(null);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && url.trim()) {
                                handleImport();
                            }
                        }}
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
