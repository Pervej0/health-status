import z from "zod";

export const appointmentValidationSchema = z.object({
  body: z.object({
    doctorId: z.string({ required_error: "DoctorId is required!" }).trim(),
    scheduleId: z.string({ required_error: "ScheduleId is required!" }).trim(),
  }),
});
