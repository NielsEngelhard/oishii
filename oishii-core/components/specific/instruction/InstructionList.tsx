"use client"

import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { Control, FieldErrors, useFieldArray, UseFormRegister } from "react-hook-form";
import InstructionInputRow from "./InstructionInputRow";

interface FormWithInstructions {
    instructions: {
        index: number;
        text: string;
    }[];
}

interface Props {
    register: UseFormRegister<FormWithInstructions>;
    control: Control<FormWithInstructions>;
    errors?: FieldErrors<FormWithInstructions>;
}

export default function InstructionInputList({ register, control, errors }: Props) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "instructions",
    });

    const handleAddInstruction = () => {
        append({ text: "", index: fields.length + 1 });
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    <InstructionInputRow
                        key={field.id}
                        index={index}
                        register={register}
                        control={control}
                        errors={errors}
                        onDelete={() => remove(index)}
                    />
                ))}
            </div>

            {/* Add Button */}
            <div>
                <Button
                    variant="skeleton"
                    Icon={Plus}
                    text="Add Instruction"
                    size="sm"
                    onClick={handleAddInstruction}
                    type="button"
                />
            </div>
        </div>
    );
}
