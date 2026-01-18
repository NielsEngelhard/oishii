ALTER TABLE "recipes" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;