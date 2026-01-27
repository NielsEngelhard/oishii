"use client"

import Avatar from "@/components/ui/Avatar";
import Tag from "@/components/ui/Tag";
import ShareButton from "@/components/specific/share/ShareButton";
import { IRecipeTeaser } from "@/models/recipe-models";
import { getOfficialTagEmoji } from "@/lib/constants/official-tags";
import { Clock, Heart, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";

interface Props {
    recipe: IRecipeTeaser;
    onLikeChange?: (recipeSlug: string, isLiked: boolean) => void;
}

function getDifficultyLabel(difficulty: string): string {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

export default function RecipeCard({ recipe, onLikeChange }: Props) {
    const tTags = useTranslations("tags");
    const [isLiked, setIsLiked] = useState(recipe.isLiked);
    const [likeCount, setLikeCount] = useState(recipe.likeCount);
    const [isLiking, setIsLiking] = useState(false);

    // Get first 2 tags for display
    const displayTags = recipe.tags?.slice(0, 2) || [];
    const remainingTagCount = (recipe.tags?.length || 0) - 2;

    const getTagLabel = (tag: { key: string; isOfficial: boolean }) => {
        if (tag.isOfficial) {
            const emoji = getOfficialTagEmoji(tag.key);
            try {
                const label = tTags(tag.key as any);
                return emoji ? `${emoji} ${label}` : label;
            } catch {
                return tag.key;
            }
        }
        return tag.key;
    };

    const handleLikeClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (recipe.isOwner || isLiking) return;

        setIsLiking(true);
        try {
            const response = await fetch(`/api/recipe/${recipe.slug}/like`, {
                method: "POST",
            });

            if (response.ok) {
                const data = await response.json();
                setIsLiked(data.isLiked);
                setLikeCount(prev => data.isLiked ? prev + 1 : prev - 1);
                onLikeChange?.(recipe.slug, data.isLiked);
            }
        } finally {
            setIsLiking(false);
        }
    };

    return (
        <Link href={`/recipe/${recipe.slug}`}>
            <div className="group relative flex flex-col rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
                {/* Category accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent z-10" />

                {/* Image */}
                <div className="relative w-full h-52 overflow-hidden">
                    <Image
                        src={recipe.imageUrl || "/placeholder/recipe-placeholder.png"}
                        alt={recipe.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-primary/10" />

                    <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                        <ShareButton recipeSlug={recipe.slug} recipeTitle={recipe.title} variant="card" />
                        <Tag text={getDifficultyLabel(recipe.difficulty)} variant="secondary" />
                    </div>

                    {/* Like button - only show if not owner */}
                    {!recipe.isOwner && (
                        <button
                            onClick={handleLikeClick}
                            disabled={isLiking}
                            className={clsx(
                                "absolute top-3 left-3 z-20 p-2 rounded-full transition-all duration-200",
                                "bg-background/90 backdrop-blur-sm hover:bg-background shadow-warm",
                                "hover:scale-110 active:scale-95",
                                isLiking && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <Heart
                                size={18}
                                className={clsx(
                                    "transition-colors duration-200",
                                    isLiked ? "fill-red-500 text-red-500" : "text-muted hover:text-red-400"
                                )}
                            />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="p-4 bg-card">
                    {/* Recipe title */}
                    <h3 className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors duration-200">
                        {recipe.title}
                    </h3>

                    {/* Tags */}
                    {displayTags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {displayTags.map((tag) => (
                                <span
                                    key={tag.key}
                                    className={clsx(
                                        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
                                        tag.isOfficial
                                            ? "bg-primary/10 text-primary"
                                            : "bg-accent/50 text-foreground"
                                    )}
                                >
                                    {getTagLabel(tag)}
                                </span>
                            ))}
                            {remainingTagCount > 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-secondary text-muted">
                                    {tTags("moreCount", { count: remainingTagCount })}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Meta row with colored icons */}
                    <div className="flex items-center gap-4 mt-2 text-muted">
                        <span className="flex items-center gap-1 text-sm">
                            <Clock size={14} className="text-primary" />
                            {recipe.cookTime} min
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                            <Users size={14} className="text-secondary" />
                            {recipe.servings}
                        </span>
                    </div>

                    {/* Author with avatar - more prominent */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-2">
                            <Avatar size="sm" className="ring-1 ring-primary/20" />
                            <span className="font-medium text-sm">{recipe.author.name}</span>
                        </div>

                        {/* Likes */}
                        <div className="flex items-center gap-1 text-muted">
                            <Heart
                                size={16}
                                className={clsx(
                                    isLiked && "fill-red-500 text-red-500"
                                )}
                            />
                            <span className="text-sm font-medium">{likeCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}