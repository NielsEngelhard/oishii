"use client";

import { CREATE_RECIPE_ROUTE } from "@/app/routes";
import RecipeGrid from "@/components/specific/recipe/RecipeGrid";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/layout/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import { IPaginatedResponse, IRecipeTeaser } from "@/models/recipe-models";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const PAGE_SIZE = 10;

export default function MyRecipesPage() {
    const t = useTranslations("recipe");
    const tCommon = useTranslations("common");
    const [recipes, setRecipes] = useState<IRecipeTeaser[]>([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<IPaginatedResponse<IRecipeTeaser>["pagination"] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRecipes = useCallback(async (pageNum: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/recipes/my?page=${pageNum}&pageSize=${PAGE_SIZE}`);
            if (!response.ok) {
                throw new Error("Failed to fetch recipes");
            }
            const data: IPaginatedResponse<IRecipeTeaser> = await response.json();
            setRecipes(data.items);
            setPagination(data.pagination);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecipes(page);
    }, [page, fetchRecipes]);

    const handlePreviousPage = () => {
        if (pagination?.hasPreviousPage) {
            setPage((p) => p - 1);
        }
    };

    const handleNextPage = () => {
        if (pagination?.hasNextPage) {
            setPage((p) => p + 1);
        }
    };

    return (
        <div className="flex flex-col container py-4 lg:py-6 space-y-6">

            <PageHeader
                title={t("myRecipes")}
                description={t("personalCollection")}
            >
                <Link href={CREATE_RECIPE_ROUTE}>
                    <Button
                        text={tCommon("create")}
                        Icon={Plus}
                    />
                </Link>
            </PageHeader>

            <SearchBar />

            {isLoading ? (
                <div className="text-center py-12 text-muted">{tCommon("loading")}</div>
            ) : (
                <>
                    <RecipeGrid recipes={recipes} />

                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 pt-4">
                            <button
                                onClick={handlePreviousPage}
                                disabled={!pagination.hasPreviousPage}
                                className="px-4 py-2 rounded-lg bg-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 transition-colors"
                            >
                                {tCommon("previous")}
                            </button>
                            <span className="text-sm text-muted">
                                {tCommon("page", { current: pagination.page, total: pagination.totalPages })}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={!pagination.hasNextPage}
                                className="px-4 py-2 rounded-lg bg-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 transition-colors"
                            >
                                {tCommon("next")}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}