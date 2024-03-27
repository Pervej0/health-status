import z from "zod";

export const AdminValidationSchema = z.object({
  password: z.string({ required_error: "Password is required!" }),
  admin: z.object({
    name: z.string({ required_error: "Name is required!" }).trim(),
    email: z.string({ required_error: "Email is required!" }).trim(),
    contactNumber: z
      .string({ required_error: "Contact Number is required!" })
      .trim(),
    profilePhoto: z.string().trim().optional(),
  }),
});
