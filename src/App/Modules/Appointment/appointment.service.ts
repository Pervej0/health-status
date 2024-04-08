import { Appointment } from "@prisma/client";
import { TAuthUser } from "../../interfaces/global";
import prisma from "../../../shared/prisma";
import { v4 as uuidv4 } from "uuid";

export const createAppointmentDB = async (
  user: TAuthUser,
  payload: Partial<Appointment>
) => {
  const patient = await prisma.patient.findUniqueOrThrow({
    where: { email: user?.email },
  });

  const doctor = await prisma.doctor.findFirstOrThrow({
    where: { id: payload.doctorId },
  });

  const doctorSchedule = await prisma.doctorSchedules.findUniqueOrThrow({
    where: {
      doctorId_scheduleId: {
        doctorId: doctor.id,
        scheduleId: payload.scheduleId as string,
      },
      isBooked: false,
    },
  });

  const videoCallingId = uuidv4();
  payload.patientId = patient.id;
  payload.scheduleId = doctorSchedule.scheduleId;
  payload.doctorId = doctor.id;
  payload.videoCallingId = videoCallingId;

  const result = await prisma.$transaction(async (tx) => {
    const createAppointment = await tx.appointment.create({
      data: payload as any,
    });

    // update doctor schedule
    await prisma.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctor.id,
          scheduleId: payload.scheduleId as string,
        },
      },
      data: {
        isBooked: true,
        appointmentId: createAppointment.id,
      },
    });

    return createAppointment;
  });

  return result;
};
