CREATE TYPE "public"."recipe_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."ingredient_unit" AS ENUM('ml', 'l', 'tsp', 'tbsp', 'cup', 'mg', 'g', 'kg', 'oz', 'lb', 'cm', 'mm', 'piece', 'clove', 'slice', 'pinch', 'dash', 'to_taste', 'none');--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"prep_time" text,
	"cook_time" text NOT NULL,
	"servings" integer NOT NULL,
	"difficulty" "recipe_difficulty" NOT NULL,
	"ingredients" jsonb NOT NULL,
	"instructions" jsonb NOT NULL
);
