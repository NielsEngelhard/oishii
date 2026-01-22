-- First convert existing text notes to jsonb array format
UPDATE "recipes"
SET "notes" = jsonb_build_array(jsonb_build_object('text', "notes"))
WHERE "notes" IS NOT NULL AND "notes"::text != '';

-- Then change the column type to jsonb
ALTER TABLE "recipes" ALTER COLUMN "notes" SET DATA TYPE jsonb USING "notes"::jsonb;