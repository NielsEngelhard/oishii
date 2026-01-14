import { createRecipeSchema } from "@/schemas/recipe-schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // TODO: dit gedeelte is 1 grote copy paste
        const body = await req.json();
        
        const result = createRecipeSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0]?.message || "Invalid input" },
                { status: 400 }
            );
        }        

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        return NextResponse.json({ error: message }, { status: 401 });
    }
}