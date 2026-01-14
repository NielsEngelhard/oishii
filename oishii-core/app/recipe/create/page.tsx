"use client"

import Input from "@/components/form/Input";
import InputGroup from "@/components/form/InputGroup";
import NumberInput from "@/components/form/NumberInput";
import SelectButtonInput from "@/components/form/SelectButtonInput";
import TextArea from "@/components/form/TextArea";
import IngredientInputList from "@/components/specific/ingredient/IngredientInputList";
import AiImportCard from "@/components/specific/recipe/AiImportCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { createRecipeSchema, CreateRecipeSchemaData } from "@/schemas/recipe-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Gauge, Plus, Users } from "lucide-react";
import { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";

export default function CreateRecipePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateRecipeSchemaData>({
        resolver: zodResolver(createRecipeSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: CreateRecipeSchemaData) => {
        console.log("Save recipe");
    }

    return (
        <div className="flex flex-col container py-4 lg:py-6 space-y-6 max-w-3xl">
            
            <div className="">
                <h1 className="text-2xl font-bold">Create Recipe</h1>
                <p className="text-muted">Share your culinary creation with the world</p>
            </div>

            <AiImportCard />

            <Card>
                <h2 className="mb-2">Basic information</h2>

                <InputGroup>
                    <Input
                        label="Recipe Title"
                        type="text"
                        placeholder="Grandma's secret ramen"
                        error={(errors as FieldErrors<CreateRecipeSchemaData>).title?.message}
                        {...register("title")}
                    />

                    <TextArea
                        label="Recipe Description"
                        placeholder="A brief description about your recipe..."
                        error={(errors as FieldErrors<CreateRecipeSchemaData>).description?.message}
                        {...register("description")}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                        <NumberInput
                            label="Prep Time"
                            Icon={Clock}
                            postFix="minutes"
                            placeholder="15"
                            error={(errors as FieldErrors<CreateRecipeSchemaData>).prepTime?.message}
                            {...register("prepTime", { valueAsNumber: true })}
                        />

                        <NumberInput
                            label="Cook Time"
                            Icon={Clock}
                            postFix="minutes"
                            error={(errors as FieldErrors<CreateRecipeSchemaData>).cookTime?.message}
                            placeholder="30"
                            {...register("cookTime", { valueAsNumber: true })}
                        />

                        <NumberInput
                            label="Servings"
                            Icon={Users}
                            postFix="people"
                            placeholder="4"
                            error={(errors as FieldErrors<CreateRecipeSchemaData>).servings?.message}
                            {...register("servings", { valueAsNumber: true })}
                        />
                    </div>

                    <SelectButtonInput
                        {...register("difficulty")}
                        value={watch("difficulty")}
                        onChange={(value) => setValue("difficulty", value as "easy" | "medium" | "hard")}
                        options={[
                            { label: "Easy", value: "easy" },
                            { label: "Medium", value: "medium" },
                            { label: "Hard", value: "hard" }
                        ]}
                        label="Difficulty"
                        Icon={Gauge}
                        error={(errors as FieldErrors<CreateRecipeSchemaData>).difficulty?.message}
                    />
                </InputGroup>
            </Card>

            <Card>
                <h2>Ingredients</h2>

                <IngredientInputList
                    ingredients={[{ name: "lol", unit: "gram" }]}
                />
            </Card>

            <Card>
                <h2>Instructions</h2>

                <div>
                    LOOOL
                </div>
            </Card>                        
        </div>
    )
}