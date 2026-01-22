import z from "zod";

export const noteSchema = z.object({
  title: z.string().max(50, "Title too long").optional(),
  text: z.string().min(1, "Note text is required").max(500, "Note too long"),
  imageUrl: z.url().optional(),
});

export type NoteSchemaData = z.infer<typeof noteSchema>;
