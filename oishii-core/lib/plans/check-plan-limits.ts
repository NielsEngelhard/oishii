import { db } from "@/lib/db/db";
import { aiUsageTable, recipesTable, usersTable } from "@/db/schema";
import { UserPlan } from "@/db/schemas/enum/user-plan";
import { and, count, eq, gte } from "drizzle-orm";
import { PLAN_LIMITS } from "./plan-limits";

export interface AiLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  plan: UserPlan;
}

export interface RecipeLimitResult {
  allowed: boolean;
  current: number;
  max: number;
  plan: UserPlan;
}

/**
 * Get the start of today (midnight UTC)
 */
function getStartOfDay(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/**
 * Get the start of this month (first day at midnight UTC)
 */
function getStartOfMonth(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

/**
 * Get the reset time for the AI limit based on plan type
 */
function getResetTime(plan: UserPlan): Date {
  if (plan === "premium") {
    // Premium resets at start of next month
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  }
  // Free and Basic reset at midnight tomorrow
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  return new Date(Date.UTC(tomorrow.getUTCFullYear(), tomorrow.getUTCMonth(), tomorrow.getUTCDate()));
}

/**
 * Check if a user can perform an AI action based on their plan limits
 */
export async function checkAiLimit(userId: number): Promise<AiLimitResult> {
  // Get user's plan
  const user = await db.select({ plan: usersTable.plan })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  if (!user.length) {
    return { allowed: false, remaining: 0, resetAt: new Date(), plan: "free" };
  }

  const plan = user[0].plan;
  const limits = PLAN_LIMITS[plan];

  // Admin has unlimited access
  if (plan === "admin") {
    return { allowed: true, remaining: Infinity, resetAt: new Date(), plan };
  }

  // Determine the period and limit based on plan
  let periodStart: Date;
  let limit: number;

  if (plan === "premium") {
    periodStart = getStartOfMonth();
    limit = limits.aiActionsPerMonth ?? Infinity;
  } else {
    periodStart = getStartOfDay();
    limit = limits.aiActionsPerDay ?? 0;
  }

  // Count usage in the current period
  const usage = await db.select({ count: count() })
    .from(aiUsageTable)
    .where(
      and(
        eq(aiUsageTable.userId, userId),
        gte(aiUsageTable.createdAt, periodStart)
      )
    );

  const usageCount = usage[0]?.count ?? 0;
  const remaining = Math.max(0, limit - usageCount);

  return {
    allowed: usageCount < limit,
    remaining,
    resetAt: getResetTime(plan),
    plan,
  };
}

/**
 * Record an AI usage event for a user
 */
export async function recordAiUsage(userId: number, action: "url_scrape" | "text_parse" | "photo_parse" | "image_enhance"): Promise<void> {
  await db.insert(aiUsageTable).values({
    userId,
    action,
  });
}

/**
 * Check if a user can create more recipes based on their plan limits
 */
export async function checkRecipeLimit(userId: number): Promise<RecipeLimitResult> {
  // Get user's plan
  const user = await db.select({ plan: usersTable.plan })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  if (!user.length) {
    return { allowed: false, current: 0, max: 0, plan: "free" };
  }

  const plan = user[0].plan;
  const limits = PLAN_LIMITS[plan];

  // Count user's current recipes
  const recipeCount = await db.select({ count: count() })
    .from(recipesTable)
    .where(eq(recipesTable.userId, userId));

  const current = recipeCount[0]?.count ?? 0;
  const max = limits.maxRecipes;

  return {
    allowed: current < max,
    current,
    max,
    plan,
  };
}
