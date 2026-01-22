"use client"

import Button from "@/components/ui/Button";
import { NoteSchemaData } from "@/schemas/note-schemas";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Control, FieldErrors, useFieldArray, UseFormRegister, UseFormSetValue } from "react-hook-form";
import NoteInputRow from "./NoteInputRow";

const MAX_NOTES = 10;

interface FormWithNotes {
    notes: NoteSchemaData[];
}

interface Props {
    register: UseFormRegister<FormWithNotes>;
    control: Control<FormWithNotes>;
    errors?: FieldErrors<FormWithNotes>;
    setValue: UseFormSetValue<FormWithNotes>;
}

export default function NoteInputList({ register, control, errors, setValue }: Props) {
    const t = useTranslations("recipe");
    const { fields, append, remove } = useFieldArray({
        control,
        name: "notes",
    });

    const handleAddNote = () => {
        if (fields.length < MAX_NOTES) {
            append({ text: "" });
        }
    };

    const handleImageChange = (index: number, url: string | undefined) => {
        setValue(`notes.${index}.imageUrl`, url);
    };

    const canAddMore = fields.length < MAX_NOTES;

    return (
        <div className="flex flex-col gap-3">
            {fields.length === 0 ? (
                <p className="text-muted text-sm">{t("noNotesYet")}</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {fields.map((field, index) => (
                        <NoteInputRow
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
            )}

            {/* Error message for notes array */}
            {errors?.notes?.root?.message && (
                <p className="text-sm text-error">{errors.notes.root.message}</p>
            )}
            {errors?.notes?.message && (
                <p className="text-sm text-error">{errors.notes.message}</p>
            )}

            {/* Add Button */}
            <div className="flex items-center gap-2">
                <Button
                    variant="skeleton"
                    Icon={Plus}
                    text={t("addNote")}
                    size="sm"
                    onClick={handleAddNote}
                    type="button"
                    disabled={!canAddMore}
                />
                {!canAddMore && (
                    <span className="text-sm text-muted">{t("maxNotesReached")}</span>
                )}
            </div>
        </div>
    );
}
