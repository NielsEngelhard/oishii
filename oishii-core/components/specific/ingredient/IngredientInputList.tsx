import { ingredientSchemaData } from "@/schemas/ingredient-schemas"
import IngredientInputRow from "./IngredientInputRow";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";

interface Props {
    ingredients: ingredientSchemaData[];
}

export default function IngredientInputList({ ingredients }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <div>TODO: Header items stating what which column is</div>

            <div className="flex flex-col gap-2">
                {ingredients.map((x) => (
                    <IngredientInputRow key={x.name}
                        onDelete={() => {}}
                    />
                ))}
            </div>

            <div>
                <Button
                    variant="skeleton"
                    Icon={Plus}
                    text="Add Ingredient"
                    size="sm"                    
                /> 
            </div>
        </div>
    )
}