import { Gender } from "@prisma/client";
import z from "zod";

export const updateDoctorValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required!" }).optional(),
    email: z.string({ required_error: "Email is required!" }).trim().optional(),
    contactNumber: z
      .string({ required_error: "Contact Number is required!" })
      .optional(),
    address: z.string().optional().nullable().optional(),
    registrationNumber: z.string().optional(),
    experience: z.number().int().default(0).optional(),
    gender: z.enum([Gender.Female, Gender.Male]).optional(),
    appointmentFee: z
      .number({ required_error: "Appointment Fee is required!" })
      .int()
      .optional(),
    qualification: z
      .string({ required_error: "Qualification is required!" })
      .optional(),
    currentWorkingPlace: z
      .string({
        required_error: "Current Working Place is required!",
      })
      .optional(),
    designation: z
      .string({ required_error: "Designation is required!" })
      .optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});
