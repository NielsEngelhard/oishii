"use client";

import { CREATE_RECIPE_ROUTE } from "@/app/routes";
import RecipeGrid from "@/components/specific/recipe/RecipeGrid";
import RecipesFilter, { RecipeFilterValues } from "@/components/specific/recipe/RecipesFilter";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/layout/PageHeader";
import { IPaginatedResponse, IRecipeTeaser } from "@/models/recipe-models";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 10;

export default function MyRecipesPage() {
    const t = useTranslations("recipe");
    const tCommon = useTranslations("common");
    const [recipes, setRecipes] = useState<IRecipeTeaser[]>([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<IPaginatedResponse<IRecipeTeaser>["pagination"] | null>(null);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [includeLiked, setIncludeLiked] = useState(true);
    const [filters, setFilters] = useState<RecipeFilterValues>({
        search: "",
        cuisine: "",
        difficulty: "",
        totalTime: "",
    });

    // Ref for debounce timeout
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    // Track if initial total has been fetched
    const initialTotalFetched = useRef(false);

    const fetchRecipes = useCallback(async (pageNum: number, currentFilters: RecipeFilterValues, includeL: boolean) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(pageNum),
                pageSize: String(PAGE_SIZE),
                includeLiked: String(includeL),
            });

            if (currentFilters.search) {
                params.set("search", currentFilters.search);
            }
            if (currentFilters.difficulty) {
                params.set("difficulty", currentFilters.difficulty);
            }
            if (currentFilters.totalTime) {
                params.set("totalTime", currentFilters.totalTime);
            }
            // Note: cuisine filter is mocked for now, not sent to backend

            const response = await fetch(`/api/recipes/my?${params.toString()}`);
            if (!response.ok) {
                throw new Error("Failed to fetch recipes");
            }
            const data: IPaginatedResponse<IRecipeTeaser> = await response.json();
            setRecipes(data.items);
            setPagination(data.pagination);

            // On first load without filters, store the total count
            if (!initialTotalFetched.current && !currentFilters.search && !currentFilters.difficulty && !currentFilters.totalTime && includeL) {
                setTotalItems(data.pagination.totalItems);
                initialTotalFetched.current = true;
            }
        } catch (error) {
            console.error("Error fetching recipes:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch total items count once on mount (without filters)
    useEffect(() => {
        const fetchTotalCount = async () => {
            try {
                const response = await fetch(`/api/recipes/my?page=1&pageSize=1&includeLiked=true`);
                if (response.ok) {
                    const data: IPaginatedResponse<IRecipeTeaser> = await response.json();
                    setTotalItems(data.pagination.totalItems);
                    initialTotalFetched.current = true;
                }
            } catch (error) {
                console.error("Error fetching total count:", error);
            }
        };
        fetchTotalCount();
    }, []);

    // Fetch recipes when page or filters change (except search which is debounced)
    useEffect(() => {
        fetchRecipes(page, filters, includeLiked);
    }, [page, filters.difficulty, filters.totalTime, filters.cuisine, includeLiked, fetchRecipes]);

    // Handle search with debouncing
    const handleSearchChange = useCallback((search: string) => {
        setFilters(prev => ({ ...prev, search }));

        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for debounced search
        searchTimeoutRef.current = setTimeout(() => {
            setPage(1); // Reset to first page on search
            fetchRecipes(1, { ...filters, search }, includeLiked);
        }, 500);
    }, [filters, includeLiked, fetchRecipes]);

    // Handle includeLiked change
    const handleIncludeLikedChange = useCallback((value: boolean) => {
        setIncludeLiked(value);
        setPage(1); // Reset to first page
    }, []);

    // Handle filter changes (immediate)
    const handleFilterChange = useCallback((newFilters: RecipeFilterValues) => {
        setFilters(newFilters);
        setPage(1); // Reset to first page on filter change
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

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

            <RecipesFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearchChange={handleSearchChange}
                totalItems={totalItems}
                filteredItems={pagination?.totalItems ?? 0}
                includeLiked={includeLiked}
                onIncludeLikedChange={handleIncludeLikedChange}
                showLikedToggle={true}
            />

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
