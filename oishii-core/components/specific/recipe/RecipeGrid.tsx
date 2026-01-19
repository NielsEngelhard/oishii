import { IRecipeTeaser } from "@/models/recipe-models";
import RecipeCard from "./RecipeCard";

interface Props {
    recipes: IRecipeTeaser[];
}

export default function RecipeGrid({ recipes }: Props) {
    if (recipes.length === 0) {
        return (
            <div className="text-center py-12 text-muted">
                <p>No recipes found. Create your first recipe!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
        </div>
    );
}