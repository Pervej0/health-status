import { Schedule } from "@prisma/client";
import moment from "moment";
import { TSchedule } from "./schedule.interface";
import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";

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
      const schedule = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, interval),
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
