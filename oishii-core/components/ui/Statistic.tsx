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
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    default: "text-foreground"
  };    
    
    return (
        <div className="flex flex-col items-center">
            {Icon && <Icon size={20} className={clsx(variantStyles[variant])} />}
        
            <span className="text-muted text-sm mt-2">{label}</span>
            <span className="text-lg font-medium">{value}</span>
        </div>
    )
}