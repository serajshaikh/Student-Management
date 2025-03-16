import { z } from "zod";

export const ReqSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "'email' field is required" }),

    name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" })
    .regex(/^[A-Za-z\s]+$/, { message: "Name must contain only letters and spaces" }),

  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format. Use YYYY-MM-DD" }),

  academic_details: z.array(
    z.object({
      subject: z.string().min(1, { message: "Subject name is required" }),
      mark: z
        .number()
        .int()
        .min(0, { message: "Mark must be at least 0" })
        .max(100, { message: "Mark cannot exceed 100" }),
    })
  ).optional(),
});

export type ReqData = z.infer<typeof ReqSchema>;

