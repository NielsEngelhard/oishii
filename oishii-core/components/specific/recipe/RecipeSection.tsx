"use client";

import { IRecipeTeaser } from "@/models/recipe-models";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import RecipeCard from "./RecipeCard";

interface Props {
    title: string;
    recipes: IRecipeTeaser[];
    action?: ReactNode;
    isLoading?: boolean;
    initialVisible?: number;
}

function RecipeCardSkeleton() {
    return (
        <div className="flex flex-col rounded-2xl overflow-hidden shadow-warm animate-pulse">
            {/* Image skeleton */}
            <div className="relative w-full h-52 bg-secondary/20" />
            {/* Body skeleton */}
            <div className="p-4 bg-card space-y-3">
                <div className="h-5 bg-secondary/20 rounded w-3/4" />
                <div className="h-4 bg-secondary/20 rounded w-1/2" />
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                    <div className="w-8 h-8 rounded-full bg-secondary/20" />
                    <div className="h-4 bg-secondary/20 rounded w-20" />
                </div>
            </div>
        </div>
    );
}

export default function RecipeSection({
    title,
    recipes,
    action,
    isLoading = false,
    initialVisible = 6,
}: Props) {
    const t = useTranslations("explore");
    const [showAll, setShowAll] = useState(false);

    const visibleRecipes = showAll ? recipes : recipes.slice(0, initialVisible);
    const hasMore = recipes.length > initialVisible;

    return (
        <section className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="section-title">{title}</h2>
                {action}
            </div>

            {/* Recipe Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {Array.from({ length: initialVisible }).map((_, i) => (
                        <RecipeCardSkeleton key={i} />
                    ))}
                </div>
            ) : recipes.length === 0 ? (
                <div className="text-center py-12 text-muted bg-background-secondary/50 rounded-xl">
                    <p>{t("noRecipes")}</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {visibleRecipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>

                    {/* Show more/less button */}
                    {hasMore && (
                        <div className="flex justify-center pt-2">
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
                            >
                                {showAll ? (
                                    <>
                                        {t("showLess")}
                                        <ChevronUp size={16} />
                                    </>
                                ) : (
                                    <>
                                        {t("showMore")} ({recipes.length - initialVisible} more)
                                        <ChevronDown size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
