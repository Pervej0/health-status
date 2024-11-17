import { Prisma, Schedule } from "@prisma/client";
import { TSchedule } from "./schedule.interface";
import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import paginationCalculator from "../../../helper/paginationHelper";
import { TAuthUser } from "../../interfaces/global";
import CustomError from "../../errors/CustomError";
import { StatusCodes } from "http-status-codes";

const convertToUTC = (date: Date) => {
  const utcTime = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return utcTime;
};

export const createScheduleDB = async (payload: TSchedule) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const openingStartDate = new Date(startDate);
  const closingEndDate = new Date(endDate);
  const interval = 30;
  const scheduleData = [];
  while (openingStartDate <= closingEndDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(openingStartDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(openingStartDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      // set local dateTime
      // const schedule = {
      //   startDateTime: startDateTime,
      //   endDateTime: addMinutes(startDateTime, interval),
      // };

      // set utc format

      const schedule = {
        startDateTime: convertToUTC(startDateTime),
        endDateTime: convertToUTC(addMinutes(startDateTime, interval)),
      };

      const isScheduleExist = await prisma.schedule.findFirst({
        where: {
          startDateTime: schedule.startDateTime,
          endDateTime: schedule.endDateTime,
        },
      });
      if (!isScheduleExist) {
        const result = await prisma.schedule.create({
          data: schedule,
        });
        scheduleData.push(result);
      }
      // 2nd loop condition
      startDateTime.setMinutes(startDateTime.getMinutes() + 30);
    }
    // first loop condition
    openingStartDate.setDate(openingStartDate.getDate() + 1);
  }

  return scheduleData;
};

export const getAllSchedulesDB = async (
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

  // filter by startDateTime and endDateTime range
  if (startTime && endTime) {
    andCondition.push({
      AND: [
        {
          startDateTime: { gte: startTime },
        },
        {
          endDateTime: { lte: endTime },
        },
      ],
    });
  }

  // remove those schedule for a doctor, which already created by him
  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user?.email,
      },
    },
  });

  const DoctorSchedulesId = doctorSchedules.map(
    (schedule) => schedule.scheduleId
  );

  // andCondition.push({ isDeleted: false });
  const whereCondition: Prisma.ScheduleWhereInput = { AND: andCondition };

  const result = await prisma.schedule.findMany({
    where: { ...whereCondition, id: { notIn: DoctorSchedulesId } },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy as string]: sortOrder }
        : {
            createdAt: "desc",
          },
  });

  if (!result) {
    throw new CustomError(StatusCodes.NOT_FOUND, "No Schedule Found!");
  }

  const count = await prisma.schedule.count({
    where: { ...whereCondition, id: { notIn: DoctorSchedulesId } },
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

export const getSingleScheduleDB = async (scheduleId: string) => {
  const result = await prisma.schedule.findFirst({
    where: { id: scheduleId },
  });

  return result;
};

export const deleteScheduleDB = async (scheduleId: string) => {
  const schedule = await prisma.schedule.findFirst({
    where: { id: scheduleId, DoctorSchedules: { some: { scheduleId } } },
  });

  if (schedule) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Schedule Already taken by doctor!"
    );
  }

  const result = await prisma.schedule.delete({
    where: { id: scheduleId },
  });

  return result;
};
