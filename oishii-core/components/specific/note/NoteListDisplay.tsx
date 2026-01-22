import { NoteSchemaData } from "@/schemas/note-schemas";
import { Lightbulb } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

interface Props {
    notes: NoteSchemaData[];
}

export default async function NoteListDisplay({ notes }: Props) {
    const t = await getTranslations("recipe");

    if (!notes || notes.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="flex items-center gap-2">
                <Lightbulb size={20} />
                {t("tipsAndNotes")}
            </h2>

            <div className="flex flex-col gap-3">
                {notes.map((note, index) => (
                    <div
                        key={index}
                        className="flex flex-col gap-2 p-4 bg-background-secondary rounded-xl"
                    >
                        {/* Note image */}
                        {note.imageUrl && (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                <Image
                                    src={note.imageUrl}
                                    alt={note.title || `Note ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        {/* Note title */}
                        {note.title && (
                            <h3 className="font-semibold text-foreground">{note.title}</h3>
                        )}

                        {/* Note text */}
                        <p className="text-muted whitespace-pre-wrap">{note.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
