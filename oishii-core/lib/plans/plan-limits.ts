import { UserPlan } from "@/db/schemas/enum/user-plan";

export interface PlanLimits {
  aiActionsPerDay?: number;
  aiActionsPerMonth?: number;
  maxRecipes: number;
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  free: {
    aiActionsPerDay: 2,
    maxRecipes: 100,
  },
  basic: {
    aiActionsPerDay: 10,
    maxRecipes: 500,
  },
  premium: {
    aiActionsPerMonth: 1000,
    maxRecipes: Infinity,
  },
  admin: {
    // Unlimited for admins
    maxRecipes: Infinity,
  },
};

export const PLAN_PRICES: Record<Exclude<UserPlan, 'admin'>, number> = {
  free: 0,
  basic: 2,
  premium: 5.49,
};
