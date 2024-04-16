import z from "zod";

export const prescriptionValidationSchema = z.object({
  body: z.object({
    appointmentId: z.string().trim(),
    instructions: z.string().trim(),
    followUpDate: z.string().optional(),
  }),
});
