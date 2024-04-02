import { Gender } from "@prisma/client";
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

export const DoctorValidationSchema = z.object({
  password: z.string({ required_error: "Password is required" }),
  doctor: z.object({
    name: z.string({ required_error: "Name is required!" }),
    email: z.string({ required_error: "Email is required!" }).trim(),
    contactNumber: z.string({ required_error: "Contact Number is required!" }),
    address: z.string().optional().nullable(),
    registrationNumber: z.string(),
    experience: z.number().int().default(0).optional(),
    gender: z.enum([Gender.Female, Gender.Male]),
    appointmentFee: z
      .number({ required_error: "Appointment Fee is required!" })
      .int(),
    qualification: z.string({ required_error: "Qualification is required!" }),
    currentWorkingPlace: z.string({
      required_error: "Current Working Place is required!",
    }),
    designation: z.string({ required_error: "Designation is required!" }),
    isDeleted: z.boolean().default(false),
  }),
});

export const patientValidationSchema = z.object({
  password: z.string({ required_error: "Password is required" }),
  patient: z.object({
    email: z
      .string({
        required_error: "Email is required!",
      })
      .email(),
    name: z.string({
      required_error: "Name is required!",
    }),
    contactNumber: z.string({
      required_error: "Contact number is required!",
    }),
    address: z.string({
      required_error: "Address is required",
    }),
  }),
});
