"use client"

import Avatar from "@/components/ui/Avatar";
import Divider from "@/components/ui/Divider";
import MetaDataField from "@/components/ui/MetaDataField";
import Tag from "@/components/ui/Tag";
import ShareButton from "@/components/specific/share/ShareButton";
import { IRecipeTeaser } from "@/models/recipe-models";
import { Clock, Heart, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";

interface Props {
    recipe: IRecipeTeaser;
    onLikeChange?: (recipeSlug: string, isLiked: boolean) => void;
}

function getDifficultyLabel(difficulty: string): string {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

export default function RecipeCard({ recipe, onLikeChange }: Props) {
    const [isLiked, setIsLiked] = useState(recipe.isLiked);
    const [likeCount, setLikeCount] = useState(recipe.likeCount);
    const [isLiking, setIsLiking] = useState(false);

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
            <div className="flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                {/* Image */}
                <div className="relative w-full h-50 overflow-hidden">
                    <Image
                        src={recipe.imageUrl || "/placeholder/recipe-placeholder.png"}
                        alt={recipe.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    <div className="absolute top-2 right-2 z-20 flex items-center gap-2">
                        <ShareButton recipeSlug={recipe.slug} recipeTitle={recipe.title} variant="card" />
                        <Tag text={getDifficultyLabel(recipe.difficulty)} variant="secondary" />
                    </div>

                    {/* Like button - only show if not owner */}
                    {!recipe.isOwner && (
                        <button
                            onClick={handleLikeClick}
                            disabled={isLiking}
                            className={clsx(
                                "absolute top-2 left-2 z-20 p-2 rounded-full transition-all duration-200",
                                "bg-background/80 backdrop-blur-sm hover:bg-background",
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
                <div className="p-4">
                    {/* Recipe info */}
                    <div className="flex flex-col space-y-2">
                        <div>
                            <span className="text-xl">{recipe.title}</span>
                            <div className="flex gap-4">
                                <MetaDataField text={`${recipe.cookTime} min`} Icon={Clock} />
                                <MetaDataField text={String(recipe.servings)} Icon={Users} />
                            </div>
                        </div>
                    </div>

                    <Divider />

                    {/* Metadata */}
                    <div className="flex flex-row justify-between">
                        {/* By user */}
                        <div className="flex items-center gap-1 text-muted font-medium">
                            <Avatar size="sm" />
                            <span>{recipe.author.name}</span>
                        </div>

                        {/* Likes */}
                        <div className="flex items-center gap-1 text-muted">
                            <Heart
                                size={16}
                                className={clsx(
                                    isLiked && "fill-red-500 text-red-500"
                                )}
                            />
                            <span>{likeCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}