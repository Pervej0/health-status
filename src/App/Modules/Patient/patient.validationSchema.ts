import z from "zod";

export const updatePatientValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required!",
      })
      .email()
      .optional(),
    name: z
      .string({
        required_error: "Name is required!",
      })
      .optional(),
    contactNumber: z
      .string({
        required_error: "Contact number is required!",
      })
      .optional(),
    address: z
      .string({
        required_error: "Address is required",
      })
      .optional(),
  }),
});
