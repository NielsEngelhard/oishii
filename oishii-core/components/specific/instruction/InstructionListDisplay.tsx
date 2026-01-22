import { InstructionSchemaData } from "@/schemas/instruction-schemas";
import { Lightbulb } from "lucide-react";
import Image from "next/image";

interface Props {
    instructions: InstructionSchemaData[];
}

export default function InstructionListDisplay({ instructions }: Props) {
    return (
        <div className="flex flex-col">
            <div className="flex gap-2 mb-2 items-center">
                <div className="bg-primary/75 w-10 h-10 flex items-center justify-center text-lg font-medium rounded-xl text-background">{instructions.length}</div>
                <h2 className="">Instructions</h2>
            </div>

            <div className="flex flex-col gap-3">
                {instructions.map(instruction => (
                    <div key={instruction.index} className="flex flex-col bg-background-secondary rounded-lg overflow-hidden">
                        {/* Step Image */}
                        {instruction.imageUrl && (
                            <div className="relative aspect-video w-full">
                                <Image
                                    src={instruction.imageUrl}
                                    alt={`Step ${instruction.index}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        {/* Step Content */}
                        <div className="p-2 sm:p-3 flex flex-col gap-2">
                            <div className="flex gap-2 sm:gap-4 text-lg">
                                <span className="w-8 h-8 items-center justify-center flex bg-primary/10 rounded-full text-primary flex-shrink-0">{instruction.index}</span>
                                <span>{instruction.text}</span>
                            </div>

                            {/* Step Note/Tip */}
                            {instruction.note && (
                                <div className="ml-10 flex items-start gap-2 bg-primary/5 p-2 rounded-lg">
                                    <Lightbulb size={16} className="text-primary flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-muted">{instruction.note}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
