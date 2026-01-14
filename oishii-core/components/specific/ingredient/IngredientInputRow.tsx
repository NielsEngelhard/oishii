import Input from "@/components/form/Input";
import NumberInput from "@/components/form/NumberInput";
import SwitchInput from "@/components/form/SwitchInput";
import { X } from "lucide-react";

interface Props {
    onDelete: (id: string) => void;
}

export default function IngredientInputRow({  }: Props) {
    return (
        <div className="flex flex-row gap-2 items-center">

            {/* Name */}
            <Input
                placeholder="Ingredient name"
            />

            {/* Amount */}
            <NumberInput
                placeholder="Amount"
            />

            {/* Unit */}
            <NumberInput
                placeholder="Unit"
            />

            {/* Is Spice */}
            <SwitchInput
                // {...register("isPublic")}
            />

            {/* Delete */}
            <div>
                <X className="font-bold text-muted" size={20} />
            </div>
        </div>
    )
}