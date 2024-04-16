import { Prescription, Prisma, paymentStatus } from "@prisma/client";
import { TAuthUser } from "../../interfaces/global";
import prisma from "../../../shared/prisma";
import CustomError from "../../errors/CustomError";
import { StatusCodes } from "http-status-codes";
import { TPrescription } from "./prescription.interface";
import paginationCalculator from "../../../helper/paginationHelper";
import { object } from "zod";

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

export const getMyPrescriptionDB = async (
  user: TAuthUser,
  options: Record<string, unknown>
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculator(options);

  const patient = await prisma.patient.findUniqueOrThrow({
    where: { email: user?.email },
  });

  const prescription = await prisma.prescription.findMany({
    where: { patientId: patient.id },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy as string]: sortOrder }
        : { createdAt: "desc" },
  });

  const count = await prisma.prescription.count({
    where: { patientId: patient.id },
  });

  return {
    meta: {
      page,
      limit,
      total: count,
    },
    data: prescription,
  };
};

export const getAllPrescriptionDB = async (
  user: TAuthUser,
  filter: Record<string, unknown>,
  options: Record<string, unknown>
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculator(options);
  const { patientEmail, doctorEmail } = filter;
  const andConditions: Prisma.PrescriptionWhereInput[] = [];

  // filter by patientEmail, doctorEmail
  if (Object.keys(filter).length > 0) {
    andConditions.push({
      AND: [
        { doctor: { email: doctorEmail as string } },
        { patient: { email: patientEmail as string } },
      ],
    });
  }

  const whereCondition: Prisma.PrescriptionWhereInput = { AND: andConditions };

  const prescription = await prisma.prescription.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy as string]: sortOrder }
        : { createdAt: "desc" },
  });

  const count = await prisma.prescription.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: count,
    },
    data: prescription,
  };
};
