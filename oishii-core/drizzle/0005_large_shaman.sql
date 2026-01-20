ALTER TABLE "recipes" ALTER COLUMN "prep_time" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "cook_time" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "language" text DEFAULT 'en' NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "language" text DEFAULT 'en' NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "notes" text;