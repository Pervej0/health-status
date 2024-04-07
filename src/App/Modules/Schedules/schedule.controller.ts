import { RequestHandler } from "express";
import asyncCatch from "../../../shared/asyncCatch";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { createScheduleDB, getAllSchedulesDB } from "./schedule.service";
import { pick } from "../../../shared/pick";
import { scheduleSelectedQueryItems } from "./schedule.constant";
import { paginationOptionItem } from "../../../helper/paginationHelper";

export const createSchedule: RequestHandler = asyncCatch(async (req, res) => {
  const result = await createScheduleDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Schedule Created successfully!",
    data: result,
  });
});

export const getAllSchedules: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const filter = pick(req.query, scheduleSelectedQueryItems);
    const paginationOptions = pick(req.query, paginationOptionItem);
    const result = await getAllSchedulesDB(filter, paginationOptions, req.user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Schedules retrieved successfully!",
      data: result,
    });
  }
);
