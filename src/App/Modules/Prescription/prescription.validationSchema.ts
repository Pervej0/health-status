import z from "zod";

export const prescriptionValidationSchema = z.object({
  body: z.object({
    appointmentId: z
      .string({ required_error: "Appointment id is required!" })
      .trim(),
    instructions: z
      .string({ required_error: "Instructions is required!" })
      .trim(),
    followUpDate: z
      .string({ required_error: "Follow-up-date is required!" })
      .optional(),
  }),
});
