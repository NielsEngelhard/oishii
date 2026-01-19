import { ingredientSchemaData } from "@/schemas/ingredient-schemas";

interface Props {
    ingredients: ingredientSchemaData[];
}

export default function IngredientListDisplay({ ingredients }: Props) {
    return (
        <div className="flex flex-col">
            <div className="flex gap-2 mb-2 items-center">
                <div className="bg-accent w-10 h-10 flex items-center justify-center text-lg font-medium rounded-xl">{ingredients.length}</div>
                <h2>Ingredients</h2>
            </div>

            {/* // TODO: Add indicator for spice and always show the spices at the bottom. Maybe a pepper in the up right corner of the row  */}

            <div className="flex flex-col gap-2">
                {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between bg-background-secondary p-2 sm:p-3 rounded-lg text-lg">
                        <span>{ingredient.name}</span>
                        <span className="text-muted">{ingredient.amount} {ingredient.unit !== "none" && ingredient.unit}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}