"use client";

import { IngredientUnit } from "@/db/schemas/enum/ingredient-unit";
import { parseAmount, scaleAmount } from "@/lib/util/unit-conversion";
import { ingredientSchemaData } from "@/schemas/ingredient-schemas";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ServingsAdjuster from "../recipe/ServingsAdjuster";
import UnitConversionPopup from "./UnitConversionPopup";

interface Props {
    ingredients: ingredientSchemaData[];
    originalServings: number;
}

export default function IngredientListDisplay({ ingredients, originalServings }: Props) {
    const [currentServings, setCurrentServings] = useState(originalServings);
    const t = useTranslations("ingredients");
    const tRecipe = useTranslations("recipe");

    const multiplier = currentServings / originalServings;
    const isScaled = multiplier !== 1;

    return (
        <div className="flex flex-col">
            {/* Header with servings adjuster */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex gap-2 items-center">
                    <div className="bg-accent w-10 h-10 flex items-center justify-center text-lg font-medium rounded-xl">
                        {ingredients.length}
                    </div>
                    <h2>{tRecipe("ingredients")}</h2>
                </div>

                {/* Servings adjuster */}
                <div className="flex items-center gap-2 bg-background-secondary rounded-xl px-3 py-2">
                    <span className="text-sm text-muted">{t("servings")}:</span>
                    <ServingsAdjuster
                        originalServings={originalServings}
                        currentServings={currentServings}
                        onServingsChange={setCurrentServings}
                    />
                </div>
            </div>

            {/* Scaled indicator */}
            {isScaled && (
                <div className="text-xs text-primary bg-primary/10 rounded-lg px-3 py-1.5 mb-3 text-center">
                    {t("adjustedFor", { count: currentServings, original: originalServings })}
                </div>
            )}

            {/* Ingredients list */}
            <div className="flex flex-col gap-2">
                {ingredients.map((ingredient, index) => (
                    <IngredientRow
                        key={index}
                        ingredient={ingredient}
                        multiplier={multiplier}
                    />
                ))}
            </div>
        </div>
    );
}

interface IngredientRowProps {
    ingredient: ingredientSchemaData;
    multiplier: number;
}

function IngredientRow({ ingredient, multiplier }: IngredientRowProps) {
    const scaledAmountStr = scaleAmount(ingredient.amount, multiplier);
    const scaledAmount = parseAmount(scaledAmountStr);
    const unit = ingredient.unit as IngredientUnit;
    const hasAmount = scaledAmount !== null && scaledAmount > 0;

    return (
        <div className="flex justify-between items-center bg-background-secondary p-2 sm:p-3 rounded-lg text-lg">
            <span>{ingredient.name}</span>
            <div className="flex items-center">
                {hasAmount ? (
                    <UnitConversionPopup
                        unit={unit}
                        amount={scaledAmount}
                        ingredientName={ingredient.name}
                    />
                ) : (
                    <span className="text-muted">
                        {ingredient.amount} {unit !== "none" && unit}
                    </span>
                )}
            </div>
        </div>
    );
}
