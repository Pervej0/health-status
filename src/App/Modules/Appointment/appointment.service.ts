import {
  Appointment,
  Prisma,
  appointmentStatus,
  paymentStatus,
  userRole,
} from "@prisma/client";
import { TAuthUser } from "../../interfaces/global";
import prisma from "../../../shared/prisma";
import { v4 as uuidv4 } from "uuid";
import paginationCalculator from "../../../helper/paginationHelper";
import CustomError from "../../errors/CustomError";
import { StatusCodes } from "http-status-codes";

export const createAppointmentDB = async (
  user: TAuthUser,
  payload: Partial<Appointment>
) => {
  const patient = await prisma.patient.findUniqueOrThrow({
    where: { email: user?.email },
  });

  console.log(payload);
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

  console.log(videoCallingId, "video calling id");

  const result = await prisma.$transaction(async (tx) => {
    const createAppointment = await tx.appointment.create({
      data: payload as any,
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    // update doctor schedule
    await tx.doctorSchedules.update({
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

    // payment
    const today = new Date();
    const transactionId = `hc-${today.getFullYear()}-${today.getDay()}-${today.getHours()}-${today.getMinutes()}-${today.getMilliseconds()}`;
    await tx.payment.create({
      data: {
        appointmentId: createAppointment.id,
        amount: doctor.appointmentFee,
        transactionId,
      },
    });

    return createAppointment;
  });

  return result;
};

export const getMyAppointmentDB = async (
  query: Record<string, unknown>,
  option: Record<string, string>,
  user: TAuthUser
) => {
  const andConditions = [];
  const { page, limit, skip, sortOrder, sortBy } = paginationCalculator(option);
  // filter by specific field
  if (Object.keys(query).length > 0) {
    andConditions.push({
      AND: Object.keys(query).map((key) => ({
        [key]: { equals: query[key] },
      })),
    });
  }

  const whereCondition: Prisma.AppointmentWhereInput = { AND: andConditions };

  if (user?.role === userRole.PATIENT) {
    andConditions.push({
      patient: { email: user?.email },
    });
  } else if (user?.role === userRole.DOCTOR) {
    andConditions.push({ doctor: { email: user?.email } });
  }

  const result = await prisma.appointment.findMany({
    where: whereCondition,
    include: {
      // patient: true,
      // doctor: true,
      patient:
        user?.role === userRole.PATIENT
          ? false
          : { include: { patientHealthData: true, medicalReport: true } },
      doctor: user?.role === userRole.DOCTOR ? false : true,
      schedule: true,
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy as string]: sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const count = await prisma.appointment.count({ where: whereCondition });

  return {
    meta: {
      page,
      limit,
      total: count,
    },
    data: result,
  };
};

export const getAllAppointmentDB = async (
  query: Record<string, unknown>,
  option: Record<string, string>,
  user: TAuthUser
) => {
  const andConditions = [];
  const { page, limit, skip, sortOrder, sortBy } = paginationCalculator(option);
  // filter by specific field
  if (Object.keys(query).length > 0) {
    andConditions.push({
      AND: Object.keys(query).map((key) => ({
        [key]: { equals: query[key] },
      })),
    });
  }

  const whereCondition: Prisma.AppointmentWhereInput = { AND: andConditions };

  const result = await prisma.appointment.findMany({
    where: whereCondition,
    include: {
      patient: true,
      doctor: true,
      schedule: true,
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy as string]: sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const count = await prisma.appointment.count({ where: whereCondition });

  return {
    meta: {
      page,
      limit,
      total: count,
    },
    data: result,
  };
};

export const updateAppointmentStatusDB = async (
  id: string,
  payload: { status: appointmentStatus },
  user: TAuthUser
) => {
  const appointment = await prisma.appointment.findUniqueOrThrow({
    where: { id },
    include: { doctor: true },
  });

  if (
    user?.role === userRole.DOCTOR &&
    user.email !== appointment.doctor.email
  ) {
    throw new CustomError(
      StatusCodes.FORBIDDEN,
      "This is not your appointment"
    );
  }

  const update = await prisma.appointment.update({
    where: { id },
    data: {
      status: payload.status,
    },
  });

  return update;
};

export const deleteUnPaidAppointmentDB = async () => {
  const appointmentDeletedTime = 30; // after 30minutes appointment will be deleted
  const thirtyMinAgo = new Date(
    Date.now() - appointmentDeletedTime * 60 * 1000
  );
  const appointmentIds = await prisma.appointment.findMany({
    where: {
      createdAt: { lte: thirtyMinAgo },
      paymentStatus: paymentStatus.UNPAID,
    },
  });
  const unPaidAppointmentIds = appointmentIds.map(
    (appointment) => appointment.id
  );

  const result = await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: {
        appointmentId: {
          in: unPaidAppointmentIds,
        },
      },
    });

    await tx.appointment.deleteMany({
      where: {
        id: {
          in: unPaidAppointmentIds,
        },
      },
    });

    for (const appointment of appointmentIds) {
      await prisma.doctorSchedules.updateMany({
        where: {
          doctorId: appointment.doctorId,
          scheduleId: appointment.scheduleId,
        },
        data: {
          isBooked: false,
        },
      });
    }
  });
};
