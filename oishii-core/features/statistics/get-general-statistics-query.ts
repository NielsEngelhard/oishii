import { recipeLikesTable, recipesTable, usersTable } from "@/db/schema";
import { db } from "@/lib/db/db";
import { IGlobalStatistics } from "@/schemas/statistic-schemas";
import { count } from "drizzle-orm";

export default async function getGeneralStatistics(): Promise<IGlobalStatistics> {
    // Execute in parallel
    const [usersCount, likseCount, recipesCount] = await Promise.all([
      db.select({ count: count() }).from(usersTable),
      db.select({ count: count() }).from(recipeLikesTable),
      db.select({ count: count() }).from(recipesTable),
    ]);

    

    return {
        totalLikes: likseCount[0]?.count ?? 0,
        totalRecipes: recipesCount[0]?.count ?? 0,
        totalUsers: usersCount[0]?.count ?? 0, 
    }
}