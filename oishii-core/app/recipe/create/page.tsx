"use client"

import { RECIPE_DETAILS_ROUTE } from "@/app/routes";
import FileInput from "@/components/form/FileInput";
import Input from "@/components/form/Input";
import InputGroup from "@/components/form/InputGroup";
import NumberInput from "@/components/form/NumberInput";
import SelectButtonInput from "@/components/form/SelectButtonInput";
import SelectInput from "@/components/form/SelectInput";
import LanguageSelectInput from "@/components/form/LanguageSelectInput";
import TextArea from "@/components/form/TextArea";
import IngredientInputList from "@/components/specific/ingredient/IngredientInputList";
import InstructionInputList from "@/components/specific/instruction/InstructionList";
import NoteInputList from "@/components/specific/note/NoteInputList";
import AiImportCard from "@/components/specific/recipe/AiImportCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/layout/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { locales } from "@/i18n/config";
import { createRecipeSchema, CreateRecipeSchemaData } from "@/schemas/recipe-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookText, Clock, CookingPot, Gauge, List, Lightbulb, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";

export default function CreateRecipePage() {
    const router = useRouter();
    const { user } = useAuth();
    const t = useTranslations("recipe");
    const tCommon = useTranslations("common");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue, watch, control } = useForm<CreateRecipeSchemaData>({
        resolver: zodResolver(createRecipeSchema),
        mode: "onChange",
        defaultValues: {
            ingredients: [{ name: "", amount: "", unit: "g", isSpice: false }],
            instructions: [{ text: "", index: 1 }],
            notes: [],
            difficulty: "medium",
            language: "en",
        }
    });

    // Set language to user's language when user data becomes available
    useEffect(() => {
        if (user?.language) {
            setValue("language", user.language as typeof locales[number]);
        }
    }, [user?.language, setValue]);

    const onSubmit = async (data: CreateRecipeSchemaData) => {
        setIsSubmitting(true);
        setApiError(null);

        try {
            const response = await fetch('/api/recipe/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setApiError(result.error || 'An error occurred');
                return;
            }

            // Success - redirect to the new recipe
            router.push(RECIPE_DETAILS_ROUTE(result.recipeId));
        } catch {
            setApiError(tCommon('networkError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col mx-auto px-4 py-4 space-y-4 max-w-sm w-full">
            <PageHeader
                title={t("createRecipe")}
                description={t("shareCreation")}
            >

            </PageHeader>

            <AiImportCard />

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                <Card>
                    <h2 className="mb-3 flex items-center gap-2">
                        <BookText size={18} />
                        {t("basicInformation")}
                    </h2>

                    <InputGroup>
                        <FileInput
                            label={t("recipePhoto")}
                            value={watch("imageUrl")}
                            onChange={(url) => setValue("imageUrl", url)}
                            error={(errors as FieldErrors<CreateRecipeSchemaData>).imageUrl?.message}
                        />

                        <Input
                            label={t("recipeTitle")}
                            type="text"
                            placeholder={t("recipeTitlePlaceholder")}
                            error={(errors as FieldErrors<CreateRecipeSchemaData>).title?.message}
                            {...register("title")}
                        />

                        <TextArea
                            label={t("recipeDescription")}
                            placeholder={t("recipeDescriptionPlaceholder")}
                            error={(errors as FieldErrors<CreateRecipeSchemaData>).description?.message}
                            {...register("description")}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                            <NumberInput
                                label={t("prepTime")}
                                Icon={Clock}
                                postFix={t("minutes")}
                                placeholder="15"
                                error={(errors as FieldErrors<CreateRecipeSchemaData>).prepTime?.message}
                                {...register("prepTime", { valueAsNumber: true })}
                            />

                            <NumberInput
                                label={t("cookTime")}
                                Icon={Clock}
                                postFix={t("minutes")}
                                error={(errors as FieldErrors<CreateRecipeSchemaData>).cookTime?.message}
                                placeholder="30"
                                {...register("cookTime", { valueAsNumber: true })}
                            />

                            <NumberInput
                                label={t("servings")}
                                Icon={Users}
                                postFix={t("people")}
                                placeholder="4"
                                error={(errors as FieldErrors<CreateRecipeSchemaData>).servings?.message}
                                {...register("servings", { valueAsNumber: true })}
                            />
                        </div>

                        <SelectButtonInput
                            {...register("difficulty")}
                            value={watch("difficulty")}
                            onChange={(value) => setValue("difficulty", value as "easy" | "medium" | "hard")}
                            options={[
                                { label: t("difficultyEasy"), value: "easy" },
                                { label: t("difficultyMedium"), value: "medium" },
                                { label: t("difficultyHard"), value: "hard" }
                            ]}
                            label={t("difficulty")}
                            Icon={Gauge}
                            error={(errors as FieldErrors<CreateRecipeSchemaData>).difficulty?.message}
                        />

                        <LanguageSelectInput
                            label={t("originalLanguage")}
                            value={watch("language")}
                            onChange={(value) => setValue("language", value)}
                            error={(errors as FieldErrors<CreateRecipeSchemaData>).language?.message}
                        />
                    </InputGroup>
                </Card>

                <Card>
                    <h2 className="mb-3 flex items-center gap-2">
                        <CookingPot size={18} />
                        {t("ingredients")}
                    </h2>

                    <IngredientInputList
                        register={register as any}
                        control={control as any}
                        errors={errors as any}
                    />
                </Card>

                <Card>
                    <h2 className="mb-3 flex items-center gap-2">
                        <List size={18} />
                        {t("instructions")}
                    </h2>

                    <InstructionInputList
                        register={register as any}
                        control={control as any}
                        errors={errors as any}
                    />
                </Card>

                <Card>
                    <h2 className="mb-3 flex items-center gap-2">
                        <Lightbulb size={18} />
                        {t("tipsAndNotes")}
                    </h2>

                    <NoteInputList
                        register={register as any}
                        control={control as any}
                        errors={errors as any}
                        setValue={setValue as any}
                    />
                </Card>

                {/* API Error Display */}
                {apiError && (
                    <div className="p-4 bg-error/10 border border-error rounded-md">
                        <p className="text-sm text-error">{apiError}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div>
                        <Button
                            text={isSubmitting ? t("creating") : t("createRecipe")}
                            size="lg"
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <Button
                            text={tCommon("cancel")}
                            size="lg"
                            variant="skeleton"
                            type="button"
                            onClick={() => router.back()}
                        />
                    </div>
                </div>

            </form>
        </div>
    )
}