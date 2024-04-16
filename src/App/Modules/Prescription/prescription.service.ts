import { Prescription, paymentStatus } from "@prisma/client";
import { TAuthUser } from "../../interfaces/global";
import prisma from "../../../shared/prisma";
import CustomError from "../../errors/CustomError";
import { StatusCodes } from "http-status-codes";
import { TPrescription } from "./prescription.interface";

export const createPrescriptionDB = async (user: TAuthUser, payload: any) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: { email: user?.email },
  });

  const appointment = await prisma.appointment.findUniqueOrThrow({
    where: { id: payload.appointmentId, paymentStatus: paymentStatus.PAID },
    include: { doctor: true },
  });

  if (user?.email !== appointment.doctor.email) {
    throw new CustomError(
      StatusCodes.FORBIDDEN,
      "This is not your appointment"
    );
  }

  payload.patientId = appointment.patientId;
  payload.doctorId = appointment.doctorId;

  const result = await prisma.prescription.create({
    data: payload,
  });

  return result;
};
