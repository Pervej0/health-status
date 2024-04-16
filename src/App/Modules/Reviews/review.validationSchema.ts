import z from "zod";
export const reviewValidationSchema = z.object({
  body: z.object({
    appointmentId: z.string({
      required_error: "Appointment Id is required",
    }),
    rating: z.number({
      required_error: "Rating is required",
    }),
    comment: z.string({
      required_error: "Comment is required",
    }),
  }),
});
