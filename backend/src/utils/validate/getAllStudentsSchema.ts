import { z } from "zod";

// Query parameter validation schema
const getAllStudentsSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, { message: "Page must be a positive integer" }),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0, { message: "Limit must be a positive integer" }),

  search: z.string().optional(),
});

export type IGetAllStudentsSchema = z.infer<typeof getAllStudentsSchema>;
export { getAllStudentsSchema };