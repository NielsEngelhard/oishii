"use client"

import FileInput from "@/components/form/FileInput";
import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import { Camera, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Control, FieldErrors, UseFormRegister, useWatch } from "react-hook-form";

interface FormWithInstructions {
    instructions: {
        index: number;
        text: string;
        imageUrl?: string;
        note?: string;
    }[];
}

interface Props {
    index: number;
    register: UseFormRegister<FormWithInstructions>;
    control: Control<FormWithInstructions>;
    errors?: FieldErrors<FormWithInstructions>;
    onDelete: () => void;
    onImageChange: (index: number, url: string | undefined) => void;
}

export default function InstructionInputRow({ index, register, control, errors, onDelete, onImageChange }: Props) {
    const t = useTranslations("recipe");
    const [isExpanded, setIsExpanded] = useState(false);

    // Watch for existing media content
    const imageUrl = useWatch({ control, name: `instructions.${index}.imageUrl` });
    const note = useWatch({ control, name: `instructions.${index}.note` });

    // Auto-expand if there's existing content
    useEffect(() => {
        if (imageUrl || note) {
            setIsExpanded(true);
        }
    }, [imageUrl, note]);

    const hasMedia = !!imageUrl || !!note;

    return (
        <div className="flex flex-col gap-2">
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
                        placeholder={`${t("stepPlaceholder")} ${index + 1}...`}
                        {...register(`instructions.${index}.text`)}
                        error={errors?.instructions?.[index]?.text?.message}
                    />
                </div>

                {/* Camera Button */}
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`p-1 hover:bg-accent rounded-md transition-colors mt-2 ${hasMedia ? 'text-primary' : 'text-muted hover:text-foreground'}`}
                    title={t("addStepDetails")}
                >
                    <Camera size={18} />
                </button>

                {/* Delete Button */}
                <button
                    type="button"
                    onClick={onDelete}
                    className="p-1 hover:bg-accent rounded-md transition-colors mt-2"
                >
                    <X className="text-muted hover:text-foreground" size={18} />
                </button>
            </div>

            {/* Expandable Photo/Note Section */}
            {isExpanded && (
                <div className="ml-10 pl-4 border-l-2 border-primary/20 flex flex-col gap-3">
                    <FileInput
                        label={t("stepPhoto")}
                        value={imageUrl}
                        onChange={(url) => onImageChange(index, url)}
                        error={errors?.instructions?.[index]?.imageUrl?.message}
                    />

                    <Input
                        label={t("stepNote")}
                        type="text"
                        placeholder={t("stepNotePlaceholder")}
                        {...register(`instructions.${index}.note`)}
                        error={errors?.instructions?.[index]?.note?.message}
                    />
                </div>
            )}
        </div>
    );
}
