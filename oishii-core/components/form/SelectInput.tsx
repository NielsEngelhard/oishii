import { LucideIcon } from "lucide-react";
import Label from "./Label";

interface Props {
    options: string; // TODO make key value
    label?: string;
    Icon?: LucideIcon;
}

export default function SelectInput({ options, label, Icon }: Props) {
    return (
        <div className="flex flex-col">
            <div className="flex gap-1 items-center">
                {Icon && (<Icon size={12} />)}
                {label && (<Label text={label} />)}
            </div>
            <div>TODO SELECT DROPDOWN INPUT</div>
        </div>
    )
}