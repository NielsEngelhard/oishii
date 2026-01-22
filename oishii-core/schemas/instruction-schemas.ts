import z from "zod";

export const instructionSchema = z.object({
  index: z.number().min(1),
  text: z.string().min(2, "Too short").max(1000, "Too long"),
  imageUrl: z.string().url().optional(),
  note: z.string().max(200, "Note too long").optional(),
});
export type InstructionSchemaData = z.infer<typeof instructionSchema>;