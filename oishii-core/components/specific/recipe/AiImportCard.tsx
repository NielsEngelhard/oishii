"use client";

import { useState } from "react";
import Input from "@/components/form/Input";
import Button from "@/components/ui/Button";
import CookingLoader from "@/components/ui/CookingLoader";
import { Link, Sparkles, Wand2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ScrapedRecipeData } from "@/lib/ai/schemas/scraped-recipe";

interface AiImportCardProps {
    onRecipeScraped?: (recipe: ScrapedRecipeData) => void;
}

export default function AiImportCard({ onRecipeScraped }: AiImportCardProps) {
    const t = useTranslations("aiImport");
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
                return;
            }

            // Clear the input on success
            setUrl("");

            // Notify parent component
            if (onRecipeScraped && data.recipe) {
                onRecipeScraped(data.recipe);
            }
        } catch {
            setError(t("scrapeError"));
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="relative overflow-hidden rounded-2xl p-6 mb-8 border border-primary/20">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-secondary/50 to-primary/5" />

                {/* Decorative elements */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary rounded-full blur-2xl" />

                {/* Loading content */}
                <div className="relative">
                    <CookingLoader size="md" />
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-2xl p-6 mb-8 border border-primary/20">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-secondary/50 to-primary/5" />

            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary rounded-full blur-2xl" />

            {/* Content */}
            <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-[#c9532d] shadow-lg shadow-primary/25">
                    <Wand2 className="h-6 w-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                            {t("importWithAi")}
                        </h3>
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary/15 text-primary rounded-full">
                            {t("magic")}
                        </span>
                    </div>
                    <p className="text-muted text-sm mb-4">
                        {t("aiDescription")}
                    </p>

                    {/* Error message */}
                    {error && (
                        <div className="flex items-center gap-2 mb-3 p-2 bg-error/10 border border-error/20 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-error shrink-0" />
                            <p className="text-sm text-error">{error}</p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                            <Input
                                type="url"
                                placeholder={t("urlPlaceholder")}
                                className="pl-10 h-11 bg-card/80 backdrop-blur-sm"
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
                            />
                        </div>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleImport}
                            disabled={!url.trim()}
                        >
                            <Sparkles className="h-4 w-4" />
                            {t("importRecipe")}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
