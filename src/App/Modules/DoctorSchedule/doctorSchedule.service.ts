import { Prisma, userRole } from "@prisma/client";
import paginationCalculator from "../../../helper/paginationHelper";
import prisma from "../../../shared/prisma";
import { TAuthUser } from "../../interfaces/global";
import CustomError from "../../errors/CustomError";
import { StatusCodes } from "http-status-codes";

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

export const getMyScheduleDB = async (
  query: Record<string, unknown>,
  options: Record<string, unknown>,
  user: TAuthUser
) => {
  const {
    startDateTime: startTime,
    endDateTime: endTime,
    ...filterData
  } = query;
  const { page, skip, limit, sortBy, sortOrder } =
    paginationCalculator(options);
  const andCondition: object[] = [];

  // validation
  await prisma.doctor.findUniqueOrThrow({
    where: { email: user?.email },
  });

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
    where: { ...whereCondition, doctor: { email: user?.email } },
    skip,
    take: limit,
    include: {
      schedule: true,
    },
    orderBy: { [sortBy as string]: sortOrder },
  });

  const count = await prisma.doctorSchedules.count({
    where: { ...whereCondition, doctor: { email: user?.email } },
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

export const deleteDoctorScheduleDB = async (
  user: TAuthUser,
  scheduleId: string
) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: { email: user?.email },
  });

  const isBooked = await prisma.doctorSchedules.findFirst({
    where: {
      doctorId: doctor.id,
      scheduleId,
      isBooked: true,
    },
  });

  if (isBooked) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Already booked, Schedule can not be deleted!"
    );
  }

  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctor.id,
        scheduleId: scheduleId,
      },
    },
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
    searchTerm,
    ...filterData
  } = query;

  const { page, skip, limit, sortBy, sortOrder } =
    paginationCalculator(options);
  const andCondition: object[] = [];

  // search by doctor name
  if (searchTerm) {
    andCondition.push({
      doctor: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    });
  }
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
    include: {
      schedule: true,
    },
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
