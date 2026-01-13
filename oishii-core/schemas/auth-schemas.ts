import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
export type LoginSchemaData = z.infer<typeof loginSchema>;

export const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Too short").max(100, "Too long"),
  username: z.string().min(4, "Too short").max(30, "Too long")
});
export type SignUpSchemaData = z.infer<typeof signUpSchema>;