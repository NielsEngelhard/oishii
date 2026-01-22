"use client"

import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Control, FieldErrors, useFieldArray, UseFormRegister, UseFormSetValue } from "react-hook-form";
import InstructionInputRow from "./InstructionInputRow";

interface FormWithInstructions {
    instructions: {
        index: number;
        text: string;
        imageUrl?: string;
        note?: string;
    }[];
}

interface Props {
    register: UseFormRegister<FormWithInstructions>;
    control: Control<FormWithInstructions>;
    errors?: FieldErrors<FormWithInstructions>;
    setValue: UseFormSetValue<FormWithInstructions>;
}

export default function InstructionInputList({ register, control, errors, setValue }: Props) {
    const t = useTranslations("recipe");
    const { fields, append, remove } = useFieldArray({
        control,
        name: "instructions",
    });

    const handleAddInstruction = () => {
        append({ text: "", index: fields.length + 1 });
    };

    const handleImageChange = (index: number, url: string | undefined) => {
        setValue(`instructions.${index}.imageUrl`, url);
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
                        onImageChange={handleImageChange}
                    />
                ))}
            </div>

            {/* Add Button */}
            <div>
                <Button
                    variant="skeleton"
                    Icon={Plus}
                    text={t("addInstruction")}
                    size="sm"
                    onClick={handleAddInstruction}
                    type="button"
                />
            </div>
        </div>
    );
}
