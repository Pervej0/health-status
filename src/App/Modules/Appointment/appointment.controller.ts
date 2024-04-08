import { RequestHandler } from "express";
import asyncCatch from "../../../shared/asyncCatch";
import { createScheduleDB } from "../Schedules/schedule.service";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import { createAppointmentDB } from "./appointment.service";

export const createAppointment: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const result = await createAppointmentDB(req.user, req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Appointment Created successfully!",
      data: result,
    });
  }
);
