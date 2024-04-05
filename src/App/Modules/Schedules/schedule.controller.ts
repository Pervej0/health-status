import { RequestHandler } from "express";
import asyncCatch from "../../../shared/asyncCatch";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { createScheduleDB } from "./schedule.service";

export const createSchedule: RequestHandler = asyncCatch(async (req, res) => {
  const result = await createScheduleDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Schedule Created successfully!",
    data: result,
  });
});
