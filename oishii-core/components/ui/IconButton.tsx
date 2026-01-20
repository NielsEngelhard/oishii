import { Icon, LucideIcon } from "lucide-react"

interface Props {
    Icon: LucideIcon;
    onClick: () => void;
}

export default function IconButton({ Icon, onClick }: Props) {
    return (
        <button onClick={onClick} className="bg-primary rounded-xl text-background w-10 flex items-center justify-center hover:cursor-pointer">
            <Icon size={18} />
        </button>
    )
}