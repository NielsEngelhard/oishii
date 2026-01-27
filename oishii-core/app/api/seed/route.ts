import { db } from "@/lib/db/db";
import { usersTable } from "@/db/schemas/users";
import { recipesTable } from "@/db/schemas/recipes";
import { PasswordHasher } from "@/lib/security/password-hasher";
import { generateUniqueSlug } from "@/lib/util/slug-util";
import { NextResponse } from "next/server";
import { ingredientSchemaData } from "@/schemas/ingredient-schemas";
import { InstructionSchemaData } from "@/schemas/instruction-schemas";
import { IngredientUnit } from "@/db/schemas/enum/ingredient-unit";

// Random data generators
const firstNames = ["Emma", "Liam", "Sophie", "Noah", "Mila", "Daan", "Julia", "Lucas", "Sara", "Finn", "Anna", "Max"];
const lastNames = ["Jansen", "De Vries", "Van Dijk", "Bakker", "Visser", "Smit", "Meijer", "De Boer", "Mulder", "Bos"];

const recipeTitles = [
    "Classic Spaghetti Carbonara",
    "Creamy Mushroom Risotto",
    "Thai Green Curry",
    "Homemade Margherita Pizza",
    "Japanese Miso Ramen",
    "Beef Bourguignon",
    "Chicken Tikka Masala",
    "Greek Moussaka",
    "Vietnamese Pho",
    "Mexican Tacos al Pastor",
    "Korean Bibimbap",
    "French Onion Soup",
    "Indian Butter Chicken",
    "Spanish Paella",
    "Chinese Kung Pao Chicken",
    "Italian Lasagna",
    "Moroccan Tagine",
    "Turkish Kebab",
    "American BBQ Ribs",
    "British Fish and Chips",
];

const ingredients: { name: string; amount: string; unit: IngredientUnit; isSpice?: boolean }[] = [
    { name: "Olive oil", amount: "2", unit: "tbsp" },
    { name: "Garlic cloves", amount: "3", unit: "piece" },
    { name: "Onion", amount: "1", unit: "piece" },
    { name: "Salt", amount: "", unit: "to_taste", isSpice: true },
    { name: "Black pepper", amount: "", unit: "to_taste", isSpice: true },
    { name: "Butter", amount: "50", unit: "g" },
    { name: "Chicken breast", amount: "400", unit: "g" },
    { name: "Pasta", amount: "300", unit: "g" },
    { name: "Tomatoes", amount: "4", unit: "piece" },
    { name: "Parmesan cheese", amount: "100", unit: "g" },
    { name: "Heavy cream", amount: "200", unit: "ml" },
    { name: "Mushrooms", amount: "250", unit: "g" },
    { name: "Rice", amount: "300", unit: "g" },
    { name: "Soy sauce", amount: "3", unit: "tbsp" },
    { name: "Ginger", amount: "1", unit: "tbsp", isSpice: true },
    { name: "Paprika", amount: "1", unit: "tsp", isSpice: true },
    { name: "Cumin", amount: "1", unit: "tsp", isSpice: true },
    { name: "Basil leaves", amount: "10", unit: "piece" },
    { name: "Lemon juice", amount: "2", unit: "tbsp" },
    { name: "Vegetable broth", amount: "500", unit: "ml" },
];

const instructionTemplates = [
    "Preheat your oven to 180°C (350°F).",
    "Heat the oil in a large pan over medium heat.",
    "Add the chopped onions and sauté until translucent.",
    "Add the garlic and cook for another minute.",
    "Season with salt and pepper to taste.",
    "Add the main protein and cook until browned on all sides.",
    "Pour in the liquid and bring to a simmer.",
    "Reduce heat and let it cook for 20-30 minutes.",
    "Stir in the cream and let it simmer for 5 more minutes.",
    "Garnish with fresh herbs before serving.",
    "Serve hot with your favorite side dish.",
    "Let it rest for 5 minutes before slicing.",
    "Taste and adjust seasoning if needed.",
    "Transfer to a baking dish and bake for 25 minutes.",
    "Stir occasionally to prevent sticking.",
];

function randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomEmail(firstName: string, lastName: string): string {
    const random = Math.floor(Math.random() * 10000);
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${random}@example.com`;
}

function generateRandomIngredients(): ingredientSchemaData[] {
    const count = randomNumber(5, 10);
    const shuffled = [...ingredients].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function generateRandomInstructions(): InstructionSchemaData[] {
    const count = randomNumber(4, 8);
    const shuffled = [...instructionTemplates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((text, idx) => ({
        index: idx + 1,
        text,
    }));
}

export async function POST() {
    // Only allow in development
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json(
            { error: "Seeding is only available in development mode" },
            { status: 403 }
        );
    }

    try {
        // Generate random user
        const firstName = randomElement(firstNames);
        const lastName = randomElement(lastNames);
        const username = `${firstName} ${lastName}`;
        const email = generateRandomEmail(firstName, lastName);
        const hashedPassword = PasswordHasher.hash("kaaskaas");

        // Insert user
        const [newUser] = await db
            .insert(usersTable)
            .values({
                name: username,
                email,
                password: hashedPassword,
                language: randomElement(["en", "nl"]),
            })
            .returning();

        // Generate 10 random recipes
        const recipesToInsert = [];
        for (let i = 0; i < 10; i++) {
            const title = randomElement(recipeTitles) + ` by ${firstName}`;
            const slug = await generateUniqueSlug(title);

            recipesToInsert.push({
                slug,
                userId: newUser.id,
                title,
                description: `A delicious ${title.toLowerCase()} recipe. Perfect for any occasion!`,
                prepTime: randomNumber(10, 30),
                cookTime: randomNumber(15, 60),
                servings: randomNumber(2, 6),
                difficulty: randomElement(["easy", "medium", "hard"] as const),
                ingredients: generateRandomIngredients(),
                instructions: generateRandomInstructions(),
                language: newUser.language,
            });
        }

        await db.insert(recipesTable).values(recipesToInsert);

        return NextResponse.json({
            success: true,
            user: {
                username: newUser.name,
                email: newUser.email,
            },
            recipesCreated: 10,
        });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to seed data" },
            { status: 500 }
        );
    }
}
