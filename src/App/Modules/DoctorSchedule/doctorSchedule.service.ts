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
  const {
    startDateTime: startTime,
    endDateTime: endTime,
    ...filterData
  } = query;
  const { page, skip, limit, sortBy, sortOrder } =
    paginationCalculator(options);
  const andCondition: object[] = [];

  //  field filter
  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }

    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  // filter by startDateTime and endDateTime range
  if (startTime && endTime) {
    andCondition.push({
      AND: [
        {
          schedule: {
            startDateTime: { gte: startTime },
          },
        },
        {
          schedule: {
            endDateTime: { lte: endTime },
          },
        },
      ],
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
