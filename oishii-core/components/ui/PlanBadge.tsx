"use client";

import { UserPlan } from "@/db/schemas/enum/user-plan";
import { Crown, Shield, Sparkles, User } from "lucide-react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

interface PlanBadgeProps {
    plan: UserPlan;
    size?: "sm" | "md";
    showLabel?: boolean;
}

const PLAN_CONFIG = {
    free: {
        Icon: User,
        bgColor: "bg-green-200",
        textColor: "text-green-600",
    },
    basic: {
        Icon: Sparkles,
        bgColor: "bg-blue-200",
        textColor: "text-blue-600",
    },
    premium: {
        Icon: Crown,
        bgColor: "bg-primary/200",
        textColor: "text-primary",
    },
    admin: {
        Icon: Shield,
        bgColor: "bg-secondary/20",
        textColor: "text-secondary",
    },
};

export default function PlanBadge({ plan, size = "sm", showLabel = true }: PlanBadgeProps) {
    const t = useTranslations("plans");
    const config = PLAN_CONFIG[plan];
    const Icon = config.Icon;

    const sizeClasses = {
        sm: {
            container: "px-2 py-0.5 gap-1",
            icon: 12,
            text: "text-xs",
        },
        md: {
            container: "px-3 py-1 gap-1.5",
            icon: 14,
            text: "text-sm",
        },
    };

    const sizes = sizeClasses[size];

    return (
        <span
            className={clsx(
                "inline-flex items-center rounded-full font-medium",
                sizes.container,
                config.bgColor,
                config.textColor
            )}
        >
            <Icon size={sizes.icon} className={config.textColor} />
            {showLabel && (
                <span className={sizes.text}>{t(plan)}</span>
            )}
        </span>
    );
}
