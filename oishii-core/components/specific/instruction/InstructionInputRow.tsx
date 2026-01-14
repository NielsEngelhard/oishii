import TextArea from "@/components/form/TextArea";
import { X } from "lucide-react";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

interface Props {
    index: number;
    onDelete: () => void;
}

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

export default function InstructionInputRow({ index, register, control, errors, onDelete }: Props) {
    return (
        <div className="flex flex-row gap-2 md:gap-4">
            {/* Indicator */}
            <div className="">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
                    {index}
                </div>
            </div>

            {/* Input */}
            <div className="flex-1">
                <TextArea
                    placeholder={`Step ${index}`}
                />
            </div>

            {/* Close */}
            <button
                type="button"
                onClick={onDelete}
                className="p-1 hover:bg-accent rounded-md transition-colors bg-red-500"
            >
                <X className="text-muted hover:text-foreground" size={18} />
            </button>
        </div>
    )
}