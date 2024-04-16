import { Prisma, appointmentStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { TAuthUser } from "../../interfaces/global";
import CustomError from "../../errors/CustomError";
import { StatusCodes } from "http-status-codes";
import paginationCalculator from "../../../helper/paginationHelper";

export const CreateReviewDB = async (user: TAuthUser, payload: any) => {
  const patient = await prisma.patient.findUniqueOrThrow({
    where: { email: user?.email },
  });
  const appointment = await prisma.appointment.findUniqueOrThrow({
    where: { id: payload.appointmentId },
  });

  payload.patientId = patient.id;
  payload.doctorId = appointment.doctorId;
  payload.appointmentId = appointment.id;

  const result = await prisma.$transaction(async (tx) => {
    const createReview = await tx.review.create({
      data: payload,
    });
    const avgRating = await tx.review.aggregate({
      where: { doctorId: payload.doctorId },
      _avg: { rating: true },
    });
    // update doctor average rating
    await tx.doctor.update({
      where: { id: payload.doctorId },
      data: { averageRating: avgRating._avg.rating as number },
    });
    return createReview;
  });

  return result;
};

export const getAllReviewsDB = async (
  filter: Record<string, unknown>,
  options: Record<string, unknown>
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculator(options);
  const { doctorEmail, patientEmail } = filter;
  const andConditions: Prisma.ReviewWhereInput[] = [];

  // filter by patientEmail, doctorEmail
  if (Object.keys(filter).length > 0) {
    andConditions.push({
      AND: [
        { doctor: { email: doctorEmail as string } },
        { patient: { email: patientEmail as string } },
      ],
    });
  }

  const whereCondition: Prisma.ReviewWhereInput = { AND: andConditions };

  const prescription = await prisma.review.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy as string]: sortOrder }
        : { createdAt: "desc" },
  });

  const count = await prisma.review.count({
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
