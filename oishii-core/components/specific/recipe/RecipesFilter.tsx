"use client"

import SelectInput from "@/components/form/SelectInput";
import Card from "@/components/ui/Card";
import IconButton from "@/components/ui/IconButton";
import SearchBar from "@/components/ui/SearchBar";
import { ChefHat, Clock, ListFilter, Utensils } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export interface RecipeFilterValues {
    search: string;
    cuisine: string;
    difficulty: string;
    totalTime: string;
}

interface Props {
    filters: RecipeFilterValues;
    onFilterChange: (filters: RecipeFilterValues) => void;
    onSearchChange: (search: string) => void;
    totalItems: number;
    filteredItems: number;
}

export default function RecipesFilter({
    filters,
    onFilterChange,
    onSearchChange,
    totalItems,
    filteredItems,
}: Props) {
    const t = useTranslations("recipe");
    const tCommon = useTranslations("common");
    const [showFilters, setShowFilters] = useState(false);

    function toggleFilters() {
        setShowFilters(!showFilters);
    }

    const handleSelectChange = (key: keyof RecipeFilterValues, value: string) => {
        onFilterChange({
            ...filters,
            [key]: value,
        });
    };

    const cuisineOptions = [
        { label: t("allCuisines"), value: "" },
        { label: "French", value: "french" },
        { label: "Japanese", value: "japanese" },
        { label: "Italian", value: "italian" },
        { label: "Dutch", value: "dutch" },
        { label: "Mexican", value: "mexican" },
        { label: "Chinese", value: "chinese" },
        { label: "Indian", value: "indian" },
    ];

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
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <SelectInput
                            label={t("cuisine")}
                            Icon={Utensils}
                            options={cuisineOptions}
                            value={filters.cuisine}
                            onChange={(value) => handleSelectChange("cuisine", value)}
                        />

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
                </Card>
            )}

            <span className="text-muted text-sm">
                {tCommon("showing", { count: filteredItems, total: totalItems })}
            </span>
        </div>
    )
}
