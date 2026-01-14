"use client"

import Button from "@/components/ui/Button";
import { ingredientUnits } from "@/db/schema";
import { Plus } from "lucide-react";
import { Control, FieldErrors, useFieldArray, UseFormRegister } from "react-hook-form";
import IngredientInputRow from "./IngredientInputRow";

interface FormWithIngredients {
    ingredients: {
        name: string;
        amount?: string;
        unit: typeof ingredientUnits[number];
        isSpice?: boolean;
    }[];
}

interface Props {
    register: UseFormRegister<FormWithIngredients>;
    control: Control<FormWithIngredients>;
    errors?: FieldErrors<FormWithIngredients>;
}

export default function IngredientInputList({ register, control, errors }: Props) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "ingredients",
    });

    const handleAddIngredient = () => {
        append({ name: "", amount: "", unit: ingredientUnits[0], isSpice: false });
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Table Header */}
            <div className="flex flex-row gap-2 items-center text-sm text-muted font-medium border-b border-border pb-2">
                <div className="flex-[2]">Ingredient</div>
                <div className="w-24">Amount</div>
                <div className="w-28">Unit</div>
                <div className="w-16 text-center">Is spice</div>
                <div className="w-[26px]"></div>
            </div>

            {/* Ingredient Rows */}
            <div className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    <IngredientInputRow
                        key={field.id}
                        index={index}
                        register={register}
                        control={control}
                        errors={errors}
                        onDelete={() => remove(index)}
                    />
                ))}
            </div>

            {/* Error message for ingredients array */}
            {errors?.ingredients?.root?.message && (
                <p className="text-sm text-error">{errors.ingredients.root.message}</p>
            )}
            {errors?.ingredients?.message && (
                <p className="text-sm text-error">{errors.ingredients.message}</p>
            )}

            {/* Add Button */}
            <div>
                <Button
                    variant="skeleton"
                    Icon={Plus}
                    text="Add Ingredient"
                    size="sm"
                    onClick={handleAddIngredient}
                    type="button"
                />
            </div>
        </div>
    );
}
