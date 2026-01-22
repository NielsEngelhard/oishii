import IngredientListDisplay from "@/components/specific/ingredient/IngredientListDisplay";
import InstructionListDisplay from "@/components/specific/instruction/InstructionListDisplay";
import NoteListDisplay from "@/components/specific/note/NoteListDisplay";
import RecipeLikeButton from "@/components/specific/recipe/RecipeLikeButton";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import Divider from "@/components/ui/Divider";
import Statistic from "@/components/ui/Statistic";
import getRecipeDetails from "@/features/recipe/query/get-recipe-details-query";
import { getCurrentUser } from "@/lib/security/auth/get-current-user";
import { Clock, Gauge, Languages, Lightbulb, Users, Wheat } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ recipeId: string }>;
}

function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default async function RecipeDetailsPage({ params }: Props) {
    const { recipeId } = await params;
    const currentUser = await getCurrentUser();

    const recipe = await getRecipeDetails({
        recipeId,
        currentUserId: currentUser?.id,
    });
    const t = await getTranslations("recipe");
    const tLanguages = await getTranslations("languages");

    if (!recipe) {
        notFound();
    }

    const totalTime = (recipe.prepTime ?? 0) + recipe.cookTime;

    return (
        <div className="relative w-full">
            {/* Hero Image */}
            <div className="relative w-full h-64 sm:h-80 md:h-96">
                <Image
                    src={recipe.imageUrl || "/placeholder/recipe-placeholder.png"}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 via-20% to-transparent" />

                {/* Like button in hero */}
                {currentUser && (
                    <div className="absolute top-4 right-4 z-20">
                        <RecipeLikeButton
                            recipeId={recipe.id}
                            initialIsLiked={recipe.isLiked}
                            initialLikeCount={recipe.likeCount}
                            isOwner={recipe.isOwner}
                        />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="relative px-2 sm:px-6 container -mt-16 max-w-2xl flex justify-center mb-10">
            <Card>
                <div className="flex flex-col w-full p-2 sm:p-4 space-y-3 md:space-y-6">
                    {/* General text */}
                    <div className="flex flex-col">
                        <h1>{recipe.title}</h1>
                        {recipe.description && (
                            <p className="text-muted text-lg font-medium">{recipe.description}</p>
                        )}
                    </div>

                    {/* General numbers */}
                    <div className="grid grid-cols-2 md:grid-cols-4 bg-background-secondary rounded-xl py-4">
                        <Statistic
                            Icon={Clock}
                            label="Total Time"
                            value={`${totalTime} min`}
                            variant="primary"
                        />

                        <Statistic
                            Icon={Wheat}
                            label="Ingredients"
                            value={String(recipe.ingredients.length)}
                            variant="secondary"
                        />

                        <Statistic
                            Icon={Users}
                            label="Servings"
                            value={String(recipe.servings)}
                            variant="default"
                        />

                        <Statistic
                            Icon={Gauge}
                            label="Difficulty"
                            value={capitalizeFirst(recipe.difficulty)}
                            variant="accent"
                        />
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-row justify-between">
                        {/* By user */}
                        <div className="flex items-center gap-1 text-muted font-medium">
                            <Avatar />
                            <div className="flex flex-col">
                                <span>{recipe.author.name}</span>
                                <span className="text-xs">{t("recipeCreator")}</span>
                            </div>
                        </div>

                        {/* Language */}
                        <div className="flex items-center gap-1 text-muted">
                            <Languages size={16} />
                            <span className="text-sm">{tLanguages(recipe.language as "en" | "nl")}</span>
                        </div>
                    </div>

                    <div className="my-4">
                        <Divider />
                    </div>

                    {/* Ingredients */}
                    <IngredientListDisplay ingredients={recipe.ingredients} />

                    {/* Instructions */}
                    <InstructionListDisplay instructions={recipe.instructions} />

                    {/* Notes */}
                    {recipe.notes && recipe.notes.length > 0 && (
                        <>
                            <div className="my-4">
                                <Divider />
                            </div>
                            <NoteListDisplay notes={recipe.notes} />
                        </>
                    )}
                </div>
            </Card>
            </div>
        </div>
    )
}
