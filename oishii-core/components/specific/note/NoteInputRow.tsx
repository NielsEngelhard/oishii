"use client"

import FileInput from "@/components/form/FileInput";
import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import { NoteSchemaData } from "@/schemas/note-schemas";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Control, FieldErrors, UseFormRegister, useWatch } from "react-hook-form";

interface FormWithNotes {
    notes: NoteSchemaData[];
}

interface Props {
    index: number;
    register: UseFormRegister<FormWithNotes>;
    control: Control<FormWithNotes>;
    errors?: FieldErrors<FormWithNotes>;
    onDelete: () => void;
    onImageChange: (index: number, url: string | undefined) => void;
}

export default function NoteInputRow({ index, register, control, errors, onDelete, onImageChange }: Props) {
    const t = useTranslations("recipe");
    const imageUrl = useWatch({ control, name: `notes.${index}.imageUrl` });

    return (
        <div className="flex flex-col gap-3 p-4 bg-background-secondary rounded-xl relative">
            {/* Delete Button */}
            <button
                type="button"
                onClick={onDelete}
                className="absolute top-2 right-2 p-1 hover:bg-accent rounded-md transition-colors"
            >
                <X className="text-muted hover:text-foreground" size={18} />
            </button>

            {/* Note Number */}
            <div className="flex items-center gap-2 text-sm text-muted font-medium">
                <span>{t("note")} {index + 1}</span>
            </div>

            {/* Title (optional) */}
            <Input
                label={t("noteTitle")}
                placeholder={t("noteTitlePlaceholder")}
                {...register(`notes.${index}.title`)}
                error={errors?.notes?.[index]?.title?.message}
            />

            {/* Text (required) */}
            <TextArea
                label={t("noteText")}
                placeholder={t("noteTextPlaceholder")}
                {...register(`notes.${index}.text`)}
                error={errors?.notes?.[index]?.text?.message}
            />

            {/* Photo (optional) */}
            <FileInput
                label={t("notePhoto")}
                value={imageUrl}
                onChange={(url) => onImageChange(index, url)}
                error={errors?.notes?.[index]?.imageUrl?.message}
            />
        </div>
    );
}
