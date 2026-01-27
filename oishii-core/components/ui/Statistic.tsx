import clsx from "clsx";
import { LucideIcon } from "lucide-react"

interface Props {
    label: string;
    value: string;
    Icon?: LucideIcon;
    variant?: "primary" | "secondary" | "accent" | "default";
}

export default function Statistic({ label, value, Icon, variant = "primary" }: Props) {
 
  const variantStyles = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    accent: "text-accent bg-accent/20",
    default: "text-foreground bg-foreground/10"
  };

    return (
        <div className="flex flex-col items-center">
            {Icon && (
                <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center", variantStyles[variant])}>
                    <Icon size={20} />
                </div>
            )}

            <span className="text-muted text-xs mt-2">{label}</span>
            <span className="text-lg font-bold">{value}</span>
        </div>
    )
}