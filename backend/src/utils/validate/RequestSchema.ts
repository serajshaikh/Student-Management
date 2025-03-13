import { z } from "zod";

export const ReqSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "'email' field is required" }),

  name: z.string().min(2, { message: "Invalid name" }),

  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format. Use YYYY-MM-DD" }) 
});

export type ReqData = z.infer<typeof ReqSchema>;
