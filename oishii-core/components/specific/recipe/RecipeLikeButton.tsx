"use client"

import { Heart } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface Props {
    recipeSlug: string;
    initialIsLiked: boolean;
    initialLikeCount: number;
    isOwner: boolean;
}

export default function RecipeLikeButton({ recipeSlug, initialIsLiked, initialLikeCount, isOwner }: Props) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isLiking, setIsLiking] = useState(false);

    const handleLikeClick = async () => {
        if (isOwner || isLiking) return;

        setIsLiking(true);
        try {
            const response = await fetch(`/api/recipe/${recipeSlug}/like`, {
                method: "POST",
            });

            if (response.ok) {
                const data = await response.json();
                setIsLiked(data.isLiked);
                setLikeCount(prev => data.isLiked ? prev + 1 : prev - 1);
            }
        } finally {
            setIsLiking(false);
        }
    };

    if (isOwner) {
        return (
            <div className="flex items-center gap-1 text-muted">
                <Heart size={16} />
                <span>{likeCount}</span>
            </div>
        );
    }

    return (
        <button
            onClick={handleLikeClick}
            disabled={isLiking}
            className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200",
                "hover:scale-105 active:scale-95",
                isLiked
                    ? "bg-red-500/10 text-red-500"
                    : "bg-background-secondary text-muted hover:text-red-400",
                isLiking && "opacity-50 cursor-not-allowed"
            )}
        >
            <Heart
                size={18}
                className={clsx(
                    "transition-all duration-200",
                    isLiked && "fill-red-500"
                )}
            />
            <span className="font-medium">{likeCount}</span>
        </button>
    );
}
