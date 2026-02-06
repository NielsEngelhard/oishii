"use client"

import SelectInput from "@/components/form/SelectInput";
import Card from "@/components/ui/Card";
import IconButton from "@/components/ui/IconButton";
import SearchBar from "@/components/ui/SearchBar";
import { OFFICIAL_TAGS, getOfficialTagEmoji } from "@/lib/constants/official-tags";
import { ChefHat, Clock, Heart, ListFilter, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import clsx from "clsx";

export interface RecipeFilterValues {
    search: string;
    tags: string[];
    difficulty: string;
    totalTime: string;
}

interface Props {
    filters: RecipeFilterValues;
    onFilterChange: (filters: RecipeFilterValues) => void;
    onSearchChange: (search: string) => void;
    totalItems: number;
    filteredItems: number;
    includeLiked?: boolean;
    onIncludeLikedChange?: (includeLiked: boolean) => void;
    showLikedToggle?: boolean;
}

const MAX_VISIBLE_TAGS = 20;

export default function RecipesFilter({
    filters,
    onFilterChange,
    onSearchChange,
    totalItems,
    filteredItems,
    includeLiked = true,
    onIncludeLikedChange,
    showLikedToggle = false,
}: Props) {
    const t = useTranslations("recipe");
    const tCommon = useTranslations("common");
    const tTags = useTranslations("tags");
    const [showFilters, setShowFilters] = useState(false);
    const [tagSearch, setTagSearch] = useState("");

    function toggleFilters() {
        setShowFilters(!showFilters);
    }

    const handleSelectChange = (key: keyof RecipeFilterValues, value: string) => {
        onFilterChange({
            ...filters,
            [key]: value,
        });
    };

    const toggleTag = (tagKey: string) => {
        const newTags = filters.tags.includes(tagKey)
            ? filters.tags.filter(t => t !== tagKey)
            : [...filters.tags, tagKey];
        onFilterChange({
            ...filters,
            tags: newTags,
        });
    };

    const clearTags = () => {
        onFilterChange({
            ...filters,
            tags: [],
        });
    };

    const difficultyOptions = [
        { label: t("allDifficulties"), value: "" },
        { label: t("difficultyEasy"), value: "easy" },
        { label: t("difficultyMedium"), value: "medium" },
        { label: t("difficultyHard"), value: "hard" },
    ];

    const totalTimeOptions = [
        { label: t("allTimes"), value: "" },
        { label: t("under30min"), value: "30" },
        { label: t("under60min"), value: "60" },
        { label: t("over60min"), value: "60+" },
    ];

    // Filter and limit tags
    const filteredTags = useMemo(() => {
        let tags = [...OFFICIAL_TAGS];

        // Filter by search
        if (tagSearch) {
            const searchLower = tagSearch.toLowerCase();
            tags = tags.filter(tag => {
                const translatedName = tTags(tag.key as any).toLowerCase();
                return tag.key.toLowerCase().includes(searchLower) || translatedName.includes(searchLower);
            });
        }

        // Always show selected tags first
        const selectedTags = tags.filter(tag => filters.tags.includes(tag.key));
        const unselectedTags = tags.filter(tag => !filters.tags.includes(tag.key));

        // Limit unselected tags
        const limitedUnselected = unselectedTags.slice(0, MAX_VISIBLE_TAGS - selectedTags.length);

        return [...selectedTags, ...limitedUnselected];
    }, [tagSearch, filters.tags, tTags]);

    return (
        <div className="flex flex-col space-y-3 md:space-y-5">
            <div className="flex gap-2 md:gap-4">
                <div className="flex-1">
                    <SearchBar
                        value={filters.search}
                        onChange={onSearchChange}
                    />
                </div>
                <IconButton Icon={ListFilter} onClick={toggleFilters} />
            </div>

            {showFilters && (
                <Card>
                    <div className="space-y-4">
                        {/* Tags Filter */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-muted">{tTags("filterByTags")}</label>
                                {filters.tags.length > 0 && (
                                    <button
                                        onClick={clearTags}
                                        className="text-xs text-muted hover:text-foreground transition-colors"
                                    >
                                        {tTags("allTags")}
                                    </button>
                                )}
                            </div>

                            {/* Tag search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                                <input
                                    type="text"
                                    placeholder={tTags("searchPlaceholder")}
                                    value={tagSearch}
                                    onChange={(e) => setTagSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            {/* Tags list */}
                            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                                {filteredTags.map(tag => {
                                    const isSelected = filters.tags.includes(tag.key);
                                    const emoji = getOfficialTagEmoji(tag.key);
                                    return (
                                        <button
                                            key={tag.key}
                                            type="button"
                                            onClick={() => toggleTag(tag.key)}
                                            className={clsx(
                                                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all",
                                                "border hover:scale-105 active:scale-95",
                                                isSelected
                                                    ? "bg-primary/20 border-primary/40 text-primary"
                                                    : "bg-secondary/50 border-border text-muted hover:bg-secondary hover:text-foreground"
                                            )}
                                        >
                                            <span>{emoji}</span>
                                            <span>{tTags(tag.key as any)}</span>
                                            {isSelected && <X className="w-3 h-3 ml-0.5" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Other Filters */}
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <SelectInput
                                label={t("difficulty")}
                                Icon={ChefHat}
                                options={difficultyOptions}
                                value={filters.difficulty}
                                onChange={(value) => handleSelectChange("difficulty", value)}
                            />

                            <SelectInput
                                label={t("totalTime")}
                                Icon={Clock}
                                options={totalTimeOptions}
                                value={filters.totalTime}
                                onChange={(value) => handleSelectChange("totalTime", value)}
                            />
                        </div>
                    </div>
                </Card>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-muted text-sm">
                    {tCommon("showing", { count: filteredItems, total: totalItems })}
                </span>

                {showLikedToggle && onIncludeLikedChange && (
                    <button
                        onClick={() => onIncludeLikedChange(!includeLiked)}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all duration-200",
                            "hover:scale-105 active:scale-95",
                            includeLiked
                                ? "bg-red-500/10 text-red-500"
                                : "bg-background-secondary text-muted"
                        )}
                    >
                        <Heart
                            size={16}
                            className={clsx(includeLiked && "fill-red-500")}
                        />
                        <span>{t("includeLikedRecipes")}</span>
                    </button>
                )}
            </div>
        </div>
    )
}
