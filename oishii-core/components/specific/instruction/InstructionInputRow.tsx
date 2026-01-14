"use client"

import TextArea from "@/components/form/TextArea";
import { X } from "lucide-react";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

interface FormWithInstructions {
    instructions: {
        index: number;
        text: string;
    }[];
}

interface Props {
    index: number;
    register: UseFormRegister<FormWithInstructions>;
    control: Control<FormWithInstructions>;
    errors?: FieldErrors<FormWithInstructions>;
    onDelete: () => void;
}

export default function InstructionInputRow({ index, register, errors, onDelete }: Props) {
    return (
        <div className="flex flex-row gap-2 md:gap-4 items-start">
            {/* Step Number Indicator */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-background text-sm font-medium flex-shrink-0 mt-2">
                {index + 1}
            </div>

            {/* Hidden index field */}
            <input
                type="hidden"
                {...register(`instructions.${index}.index`)}
                value={index + 1}
            />

            {/* Text Input */}
            <div className="flex-1">
                <TextArea
                    placeholder={`Describe step ${index + 1}...`}
                    {...register(`instructions.${index}.text`)}
                    error={errors?.instructions?.[index]?.text?.message}
                />
            </div>

            {/* Delete Button */}
            <button
                type="button"
                onClick={onDelete}
                className="p-1 hover:bg-accent rounded-md transition-colors mt-2"
            >
                <X className="text-muted hover:text-foreground" size={18} />
            </button>
        </div>
    );
}
