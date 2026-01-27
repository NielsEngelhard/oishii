import { RecipeDifficulty } from "@/db/schemas/enum/recipe-difficulty";
import { ingredientSchemaData } from "@/schemas/ingredient-schemas";
import { InstructionSchemaData } from "@/schemas/instruction-schemas";
import { NoteSchemaData } from "@/schemas/note-schemas";

export interface IRecipeTag {
    key: string;
    isOfficial: boolean;
}

export interface IRecipeTeaser {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    cookTime: number;
    servings: number;
    difficulty: RecipeDifficulty;
    imageUrl: string | null;
    createdAt: Date;
    author: {
        id: number;
        name: string;
    };
    likeCount: number;
    isLiked: boolean;
    isOwner: boolean;
    tags?: IRecipeTag[];
}

export interface IPaginatedResponse<T> {
    items: T[];
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export interface IRecipeDetails {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    prepTime: number | null;
    cookTime: number;
    servings: number;
    difficulty: RecipeDifficulty;
    imageUrl: string | null;
    ingredients: ingredientSchemaData[];
    instructions: InstructionSchemaData[];
    language: string;
    notes: NoteSchemaData[] | null;
    createdAt: Date;
    updatedAt: Date;
    author: {
        id: number;
        name: string;
    };
    likeCount: number;
    isLiked: boolean;
    isOwner: boolean;
    tags: IRecipeTag[];
}