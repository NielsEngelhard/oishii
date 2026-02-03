import { AlertCircle, LucideIcon } from "lucide-react";

interface Props {
    title?: string;
    description?: string;
    Icon?: LucideIcon;
}

export default function Notification({ title, description, Icon = AlertCircle}: Props) {
    return (
        <div className="bg-primary/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                    {title && <p className="font-medium">{title}</p>}
                    {description && (
                        <p className="mt-1 opacity-80">
                            {description}
                        </p>                        
                    )}
                </div>
            </div>
        </div>        
    )
}