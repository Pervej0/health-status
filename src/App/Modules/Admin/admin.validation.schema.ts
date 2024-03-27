import { z } from "zod";

export const updateAdminValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }).trim(),
    contactNumber: z.string({ required_error: "Name is required" }).trim(),
  }),
});
