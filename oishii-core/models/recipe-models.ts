import { RecipeDifficulty } from "@/db/schemas/enum/recipe-difficulty";
import { ingredientSchemaData } from "@/schemas/ingredient-schemas";
import { InstructionSchemaData } from "@/schemas/instruction-schemas";

export interface IRecipeTeaser {
    id: string;
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
    notes: string | null;
    createdAt: Date;
    author: {
        id: number;
        name: string;
    };
}