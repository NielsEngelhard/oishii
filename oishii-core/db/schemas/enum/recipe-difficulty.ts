import { pgEnum } from "drizzle-orm/pg-core";

export const recipeDifficulties = ["easy", "medium", "hard"] as const;
export type RecipeDifficulty = (typeof recipeDifficulties)[number];

export const recipeDifficultyEnum = pgEnum('recipe_difficulty', recipeDifficulties);