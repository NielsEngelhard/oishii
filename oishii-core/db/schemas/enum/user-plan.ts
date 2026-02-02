import { pgEnum } from "drizzle-orm/pg-core";

export const userPlans = ['free', 'basic', 'premium', 'admin'] as const;
export type UserPlan = typeof userPlans[number];

export const userPlanEnum = pgEnum("user_plan", userPlans);
