"use client"

import SelectInput from "@/components/form/SelectInput";
import Card from "@/components/ui/Card";
import IconButton from "@/components/ui/IconButton";
import SearchBar from "@/components/ui/SearchBar";
import { ChefHat, Clock, ListFilter, Utensils } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface Props {

}

export default function RecipesFilter({  }: Props) {
    const t = useTranslations("recipe");
    const [showFilters, setShowFilters] = useState(false);
    const [cuisine, setCuisine] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [totalTime, setTotalTime] = useState("");

    function toggleFilters() {
        setShowFilters(!showFilters);
    }

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
                    <SearchBar />
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
                            value={cuisine}
                            onChange={setCuisine}
                        />

                        <SelectInput
                            label={t("difficulty")}
                            Icon={ChefHat}
                            options={difficultyOptions}
                            value={difficulty}
                            onChange={setDifficulty}
                        />

                        <SelectInput
                            label={t("totalTime")}
                            Icon={Clock}
                            options={totalTimeOptions}
                            value={totalTime}
                            onChange={setTotalTime}
                        />
                    </div>
                </Card>
            )}

            <span className="text-muted text-sm mt-3">Showing 4 of 4 recipes</span>
        </div>
    )
}
