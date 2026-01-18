import { RecipeDifficulty } from "@/db/schemas/enum/recipe-difficulty";

export interface IRecipeTeaser {
    id: string;
    title: string;
    description: string | null;
    cookTime: string;
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