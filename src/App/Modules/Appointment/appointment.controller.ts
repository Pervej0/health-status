import { RequestHandler } from "express";
import asyncCatch from "../../../shared/asyncCatch";
import { createScheduleDB } from "../Schedules/schedule.service";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import { createAppointmentDB, getMyAppointmentDB } from "./appointment.service";
import { pick } from "../../../shared/pick";
import { AppointmentSelectedQueryItems } from "./appointment.constant";
import { paginationOptionItem } from "../../../helper/paginationHelper";

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

export const getMyAppointment: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const filter = pick(req.query, AppointmentSelectedQueryItems);
    const pagination = pick(req.query, paginationOptionItem);

    const result = await getMyAppointmentDB(filter, pagination, req.user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Appointment fetched successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);
