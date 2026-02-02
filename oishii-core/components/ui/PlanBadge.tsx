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
        bgColor: "bg-gray-100 dark:bg-gray-800",
        textColor: "text-gray-600 dark:text-gray-400",
        iconColor: "text-gray-500",
    },
    basic: {
        Icon: Sparkles,
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        textColor: "text-blue-600 dark:text-blue-400",
        iconColor: "text-blue-500",
    },
    premium: {
        Icon: Crown,
        bgColor: "bg-amber-100 dark:bg-amber-900/30",
        textColor: "text-amber-600 dark:text-amber-400",
        iconColor: "text-amber-500",
    },
    admin: {
        Icon: Shield,
        bgColor: "bg-red-500",
        textColor: "text-white",
        iconColor: "text-white",
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
            <Icon size={sizes.icon} className={config.iconColor} />
            {showLabel && (
                <span className={sizes.text}>{t(plan)}</span>
            )}
        </span>
    );
}
