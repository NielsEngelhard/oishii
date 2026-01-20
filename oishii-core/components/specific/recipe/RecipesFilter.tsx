import SelectInput from "@/components/form/SelectInput";
import Card from "@/components/ui/Card";
import IconButton from "@/components/ui/IconButton";
import SearchBar from "@/components/ui/SearchBar";
import { ChefHat, ListFilter, Utensils } from "lucide-react";
import { useState } from "react";

interface Props {

}

export default function RecipesFilter({  }: Props) {
    const [showFilters, setShowFilters] = useState(false);

    function toggleFilters() {
        setShowFilters(!showFilters);
    }
    
    return (
        <div className="flex flex-col space-y-3 md:space-y-5">
            <div className="flex gap-2 md:gap-4">
                <div className="flex-1">
                    <SearchBar />
                </div>
                <IconButton Icon={ListFilter} onClick={toggleFilters} />
            </div>

            {/* Filters */}
            <Card className="w-full grid grid-cols-2 md:grid-cols-3">
                <SelectInput
                    label="Cuisine"
                    Icon={Utensils}
                    options="French, Japanese, Dutch etc."
                />

                <SelectInput
                    label="Difficulty"
                    Icon={ChefHat}
                    options="Enum values for difficulty (with correct translation)"
                />

                <SelectInput
                    label="Total Time"
                    Icon={Utensils}
                    options="All, under 30min, under 60min, 1+hours"
                />                                
            </Card>

            <span className="text-muted text-sm mt-3">Showing 4 of 4 recipes</span>
        </div>
    )
}