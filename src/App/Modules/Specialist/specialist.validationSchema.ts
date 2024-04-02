import z from "zod";

export const specialistValidationSchema = z.object({
  title: z.string({ required_error: "Title is required!" }),
});
