import Avatar from "@/components/ui/Avatar";
import Divider from "@/components/ui/Divider";
import MetaDataField from "@/components/ui/MetaDataField";
import Tag from "@/components/ui/Tag";
import { IRecipeTeaser } from "@/models/recipe-models";
import { Clock, Medal, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
    recipe: IRecipeTeaser;
}

function getDifficultyLabel(difficulty: string): string {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

export default function RecipeCard({ recipe }: Props) {
    return (
        <Link href={`/recipe/${recipe.id}`}>
            <div className="flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                {/* Image */}
                <div className="relative w-full h-50 overflow-hidden">
                    <Image
                        src={recipe.imageUrl || "/placeholder/recipe-placeholder.png"}
                        alt={recipe.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    <div className="absolute top-2 right-2 z-20">
                        <Tag text={getDifficultyLabel(recipe.difficulty)} variant="secondary" />
                    </div>
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
                            <Avatar />
                            <span>{recipe.author.name}</span>
                        </div>
                        
                        {/* Points */}
                        <div className="flex items-center gap-1 text-muted">
                            <Medal size={16} />
                            <span>0</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}