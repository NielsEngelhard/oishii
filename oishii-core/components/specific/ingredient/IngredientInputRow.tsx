"use client"

import Input from "@/components/form/Input";
import Select from "@/components/form/Select";
import SwitchInput from "@/components/form/SwitchInput";
import { ingredientUnits } from "@/db/schema";
import { X } from "lucide-react";
import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";

interface FormWithIngredients {
    ingredients: {
        name: string;
        amount?: string;
        unit: typeof ingredientUnits[number];
        isSpice?: boolean;
    }[];
}

interface Props {
    index: number;
    register: UseFormRegister<FormWithIngredients>;
    control: Control<FormWithIngredients>;
    errors?: FieldErrors<FormWithIngredients>;
    onDelete: () => void;
}

const unitOptions = ingredientUnits.map((unit) => ({
    label: unit.charAt(0).toUpperCase() + unit.slice(1),
    value: unit,
}));

export default function IngredientInputRow({ index, register, control, errors, onDelete }: Props) {
    return (
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            {/* Name - full width on mobile */}
            <div className="flex-1 sm:flex-[2]">
                <Input
                    placeholder="e.g. Chicken breast"
                    {...register(`ingredients.${index}.name`)}
                    error={errors?.ingredients?.[index]?.name?.message}
                />
            </div>

            {/* Amount, Unit, Spice, Delete - row on mobile */}
            <div className="flex flex-row gap-2 items-center">
                {/* Amount */}
                <div className="w-20 sm:w-24">
                    <Input
                        placeholder="100"
                        {...register(`ingredients.${index}.amount`)}
                        error={errors?.ingredients?.[index]?.amount?.message}
                    />
                </div>

                {/* Unit */}
                <div className="flex-1 sm:w-28 sm:flex-none">
                    <Select
                        options={unitOptions}
                        placeholder="Unit"
                        {...register(`ingredients.${index}.unit`)}
                        error={errors?.ingredients?.[index]?.unit?.message}
                    />
                </div>

                {/* Is Spice */}
                <div className="w-12 sm:w-16 flex justify-center">
                    <Controller
                        name={`ingredients.${index}.isSpice`}
                        control={control}
                        render={({ field }) => (
                            <SwitchInput
                                checked={field.value ?? false}
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                        )}
                    />
                </div>

                {/* Delete */}
                <button
                    type="button"
                    onClick={onDelete}
                    className="p-1 hover:bg-accent rounded-md transition-colors"
                >
                    <X className="text-muted hover:text-foreground" size={18} />
                </button>
            </div>
        </div>
    );
}
