import { db } from "@/lib/db/db";
import { recipesTable } from "@/db/schema";
import { like, sql } from "drizzle-orm";

/**
 * Converts a string to kebab-case slug
 * "Lekkere Pasta" -> "lekkere-pasta"
 */
export function toSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Replace multiple hyphens with single
}

/**
 * Generates a unique slug for a recipe title
 * Checks database for existing slugs and appends number if needed
 * "lekkere-pasta" -> "lekkere-pasta-2" -> "lekkere-pasta-3"
 */
export async function generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = toSlug(title);

    if (!baseSlug) {
        throw new Error("Cannot generate slug from empty title");
    }

    // Find all existing slugs that start with this base slug
    const existingSlugs = await db
        .select({ slug: recipesTable.slug })
        .from(recipesTable)
        .where(
            like(recipesTable.slug, `${baseSlug}%`)
        );

    if (existingSlugs.length === 0) {
        return baseSlug;
    }

    // Extract the slugs into a Set for fast lookup
    const slugSet = new Set(existingSlugs.map(r => r.slug));

    // If base slug doesn't exist, use it
    if (!slugSet.has(baseSlug)) {
        return baseSlug;
    }

    // Find the next available number
    let counter = 2;
    while (slugSet.has(`${baseSlug}-${counter}`)) {
        counter++;
    }

    return `${baseSlug}-${counter}`;
}
