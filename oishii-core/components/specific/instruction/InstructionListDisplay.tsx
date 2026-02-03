import { InstructionSchemaData } from "@/schemas/instruction-schemas";
import ExpandableImage from "@/components/ui/ExpandableImage";
import { Lightbulb } from "lucide-react";

interface Props {
    instructions: InstructionSchemaData[];
}

export default function InstructionListDisplay({ instructions }: Props) {
    return (
        <div className="flex flex-col">
            <div className="flex gap-3 mb-4 items-center">
                <div className="gradient-primary w-11 h-11 flex items-center justify-center text-lg font-bold rounded-xl text-white shadow-lg shadow-primary/20">{instructions.length}</div>
                <h2 className="section-title">Instructions</h2>
            </div>

            <div className="flex flex-col gap-4">
                {instructions.map(instruction => (
                    <div key={instruction.index} className="bg-background-secondary rounded-xl overflow-hidden shadow-warm">
                        {/* Step Content */}
                        <div className="p-3 sm:p-4 flex flex-col gap-3">
                            <div className="flex gap-3 sm:gap-4 text-lg">
                                <span className="w-8 h-8 items-center justify-center flex gradient-primary rounded-full text-white font-bold text-sm flex-shrink-0 shadow-md shadow-primary/20">{instruction.index}</span>
                                <div className="flex flex-col gap-2 flex-1">
                                    <span className="leading-relaxed">{instruction.text}</span>

                                    {/* Step Image - smaller thumbnail with click to expand */}
                                    {instruction.imageUrl && (
                                        <ExpandableImage
                                            src={instruction.imageUrl}
                                            alt={`Step ${instruction.index}`}
                                            thumbnailClassName="w-32 h-24 sm:w-40 sm:h-28"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Step Note/Tip */}
                            {instruction.note && (
                                <div className="ml-11 flex items-start gap-2 bg-secondary/10 border border-secondary/20 p-3 rounded-xl">
                                    <Lightbulb size={16} className="text-secondary flex-shrink-0 mt-0.5" />
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
