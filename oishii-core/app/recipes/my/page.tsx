import RecipeGrid from "@/components/specific/recipe/RecipeGrid";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/layout/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import { Plus } from "lucide-react";

export default function MyRecipesPage() {
    return (
        <div className="flex flex-col container py-4 lg:py-6 space-y-6 max-w-3xl">
            
            <PageHeader
                title="My Recipes"
                description="Your personal collection of recipes"
            >
                <Button
                    text="Create"
                    Icon={Plus}
                />
            </PageHeader>

            <SearchBar />

            <RecipeGrid></RecipeGrid>
        </div>
    )
}