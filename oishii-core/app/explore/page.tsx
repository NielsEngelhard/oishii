"use client";

import RecipeSection from "@/components/specific/recipe/RecipeSection";
import PageHeader from "@/components/ui/layout/PageHeader";
import { ExploreRecipesResult } from "@/features/recipe/query/get-explore-recipes-query";
import { IRecipeTeaser } from "@/models/recipe-models";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";

export default function ExplorePage() {
    const t = useTranslations("explore");

    const [randomRecipes, setRandomRecipes] = useState<IRecipeTeaser[]>([]);
    const [popularRecipes, setPopularRecipes] = useState<IRecipeTeaser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchExploreData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/explore");
            if (response.ok) {
                const data: ExploreRecipesResult = await response.json();
                setRandomRecipes(data.randomRecipes);
                setPopularRecipes(data.popularRecipes);
            }
        } catch (error) {
            console.error("Error fetching explore data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshRandomRecipes = async () => {
        setIsRefreshing(true);
        try {
            const response = await fetch("/api/explore?refresh=random");
            if (response.ok) {
                const data = await response.json();
                setRandomRecipes(data.randomRecipes);
            }
        } catch (error) {
            console.error("Error refreshing random recipes:", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchExploreData();
    }, [fetchExploreData]);

    return (
        <div className="flex flex-col container py-4 lg:py-6 space-y-8">
            <PageHeader
                title={t("title")}
                description={t("description")}
            />

            {/* Most Popular Section */}
            <RecipeSection
                title={t("mostPopular")}
                recipes={popularRecipes}
                isLoading={isLoading}
            />            

            {/* Random Picks Section */}
            <RecipeSection
                title={t("randomPicks")}
                recipes={randomRecipes}
                isLoading={isLoading}
                action={
                    <button
                        onClick={refreshRandomRecipes}
                        disabled={isRefreshing || isLoading}
                        className={clsx(
                            "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-xl",
                            "bg-primary/10 text-primary hover:bg-primary/20 transition-colors",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    >
                        <RefreshCw
                            size={16}
                            className={clsx(isRefreshing && "animate-spin")}
                        />
                        {t("refresh")}
                    </button>
                }
            />
        </div>
    );
}
