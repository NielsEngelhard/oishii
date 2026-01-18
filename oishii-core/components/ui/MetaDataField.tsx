import { LucideIcon } from "lucide-react"

interface Props {
    text: string;
    Icon?: LucideIcon;
}

export default function MetaDataField({ text, Icon }: Props) {
    return (
        <span className="flex items-center text-muted text-base">
            {Icon && <Icon size={16} />}
            &nbsp;
            {text}
        </span>        
    )
}