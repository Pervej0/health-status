import { Prisma } from "@prisma/client";
import paginationCalculator from "../../../helper/paginationHelper";
import prisma from "../../../shared/prisma";
import { TAuthUser } from "../../interfaces/global";

export const createDoctorScheduleDB = async (
  user: TAuthUser,
  payload: { schedules: string[] }
) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: { email: user?.email },
  });

  const doctorScheduleDate = payload.schedules.map((scheduleId) => ({
    doctorId: doctor.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleDate,
  });

  return result;
};

export const getAllDoctorScheduleDB = async (
  query: Record<string, unknown>,
  options: Record<string, unknown>
) => {
  const { ...filterData } = query;
  const { page, skip, limit, sortBy, sortOrder } =
    paginationCalculator(options);
  const andCondition = [];

  //  field filter
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  // andCondition.push({ isDeleted: false });
  const whereCondition: Prisma.DoctorSchedulesWhereInput = {
    AND: andCondition,
  };

  const result = await prisma.doctorSchedules.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: { [sortBy as string]: sortOrder },
  });

  console.dir(whereCondition, { depth: "infinity" });

  const count = await prisma.doctorSchedules.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: count,
    },
    data: result,
  };
};
