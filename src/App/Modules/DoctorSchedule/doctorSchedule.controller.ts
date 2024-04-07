import { Request, RequestHandler } from "express";
import asyncCatch from "../../../shared/asyncCatch";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { createDoctorScheduleDB } from "./doctorSchedule.service";

export const createDoctorSchedule: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const result = await createDoctorScheduleDB(req.user, req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Your Schedule Created successfully!",
      data: result,
    });
  }
);
