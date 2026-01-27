"use client";

import { LucideIcon, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface ImportMethodCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    onClick: () => void;
    gradient?: string;
}

export default function ImportMethodCard({
    icon: Icon,
    title,
    description,
    onClick,
    gradient = "from-primary to-[#c9532d]",
}: ImportMethodCardProps) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "w-full text-left bg-card rounded-2xl p-5 border border-border",
                "shadow-warm hover:shadow-warm-lg transition-all duration-300",
                "hover:-translate-y-1 hover:border-primary/30",
                "flex items-center gap-4 group cursor-pointer"
            )}
        >
            {/* Icon */}
            <div
                className={clsx(
                    "flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center",
                    "bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110",
                    gradient
                )}
            >
                <Icon className="w-7 h-7 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-muted text-sm line-clamp-2">
                    {description}
                </p>
            </div>

            {/* Arrow */}
            <ChevronRight
                className="flex-shrink-0 w-5 h-5 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all"
            />
        </button>
    );
}
