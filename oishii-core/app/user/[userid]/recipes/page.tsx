"use client";

import { USER_PROFILE_ROUTE } from "@/app/routes";
import RecipeGrid from "@/components/specific/recipe/RecipeGrid";
import RecipesFilter, { RecipeFilterValues } from "@/components/specific/recipe/RecipesFilter";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/layout/PageHeader";
import { buildUserRecipesUrl } from "@/lib/util/recipe-query-params";
import { IUserDetails } from "@/models/user-models";
import { IPaginatedResponse, IRecipeTeaser } from "@/models/recipe-models";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 10;

export default function UserRecipesPage() {
    const params = useParams();
    const userId = params.userid as string;
    const t = useTranslations("userProfile");
    const tRecipe = useTranslations("recipe");
    const tCommon = useTranslations("common");

    const [user, setUser] = useState<IUserDetails | null>(null);
    const [recipes, setRecipes] = useState<IRecipeTeaser[]>([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<IPaginatedResponse<IRecipeTeaser>["pagination"] | null>(null);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [includeLiked, setIncludeLiked] = useState(false);
    const [filters, setFilters] = useState<RecipeFilterValues>({
        search: "",
        tags: [],
        difficulty: "",
        totalTime: "",
    });

    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const initialTotalFetched = useRef(false);

    // Fetch user info
    const fetchUser = useCallback(async () => {
        setUserLoading(true);
        try {
            const response = await fetch(`/api/users/${userId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError(t("userNotFound"));
                } else {
                    setError("Failed to load user");
                }
                return;
            }
            const data = await response.json();
            setUser(data);
        } catch {
            setError("Failed to load user");
        } finally {
            setUserLoading(false);
        }
    }, [userId, t]);

    // Fetch recipes
    const fetchRecipes = useCallback(async (pageNum: number, currentFilters: RecipeFilterValues, includeL: boolean) => {
        setIsLoading(true);
        try {
            const url = buildUserRecipesUrl(userId, {
                page: pageNum,
                pageSize: PAGE_SIZE,
                includeLiked: includeL,
                filters: currentFilters,
            });

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch recipes");
            }
            const data: IPaginatedResponse<IRecipeTeaser> = await response.json();
            setRecipes(data.items);
            setPagination(data.pagination);

            // On first load without filters, store the total count
            if (!initialTotalFetched.current && !currentFilters.search && !currentFilters.difficulty && !currentFilters.totalTime && !includeL) {
                setTotalItems(data.pagination.totalItems);
                initialTotalFetched.current = true;
            }
        } catch (err) {
            console.error("Error fetching recipes:", err);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // Fetch total items count once on mount (without filters)
    useEffect(() => {
        const fetchTotalCount = async () => {
            try {
                const url = buildUserRecipesUrl(userId, {
                    page: 1,
                    pageSize: 1,
                    includeLiked: false,
                    filters: { search: "", tags: [], difficulty: "", totalTime: "" },
                });
                const response = await fetch(url);
                if (response.ok) {
                    const data: IPaginatedResponse<IRecipeTeaser> = await response.json();
                    setTotalItems(data.pagination.totalItems);
                    initialTotalFetched.current = true;
                }
            } catch (err) {
                console.error("Error fetching total count:", err);
            }
        };
        fetchTotalCount();
    }, [userId]);

    // Fetch recipes when page or filters change (except search which is debounced)
    useEffect(() => {
        fetchRecipes(page, filters, includeLiked);
    }, [page, filters.difficulty, filters.totalTime, filters.tags.join(","), includeLiked, fetchRecipes]);

    // Handle search with debouncing
    const handleSearchChange = useCallback((search: string) => {
        setFilters(prev => ({ ...prev, search }));

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            setPage(1);
            fetchRecipes(1, { ...filters, search }, includeLiked);
        }, 500);
    }, [filters, includeLiked, fetchRecipes]);

    // Handle includeLiked change
    const handleIncludeLikedChange = useCallback((value: boolean) => {
        setIncludeLiked(value);
        setPage(1);
    }, []);

    // Handle filter changes (immediate)
    const handleFilterChange = useCallback((newFilters: RecipeFilterValues) => {
        setFilters(newFilters);
        setPage(1);
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

    if (userLoading) {
        return (
            <div className="flex flex-col container py-4 lg:py-6 space-y-6">
                <Card className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-muted" />
                        <span className="text-muted">{tCommon("loading")}</span>
                    </div>
                </Card>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex flex-col container py-4 lg:py-6 space-y-6">
                <Card className="flex items-center justify-center py-12">
                    <span className="text-muted">{error || t("userNotFound")}</span>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col container py-4 lg:py-6 space-y-6">
            <PageHeader
                title={t("usersRecipes", { name: user.name })}
                description={t("recipesCreatedBy", { name: user.name })}
            >
                <Link href={USER_PROFILE_ROUTE(userId)}>
                    <Button
                        text={t("backToProfile")}
                        Icon={ArrowLeft}
                        variant="skeleton"
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
            ) : recipes.length === 0 ? (
                <Card className="flex items-center justify-center py-12">
                    <span className="text-muted">{t("noRecipesYet")}</span>
                </Card>
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
    );
}
