import { Request, RequestHandler } from "express";
import asyncCatch from "../../../shared/asyncCatch";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import {
  createDoctorScheduleDB,
  getAllDoctorScheduleDB,
} from "./doctorSchedule.service";
import { pick } from "../../../shared/pick";
import { DoctorScheduleSelectedQueryItems } from "./doctorSchedule.constant";
import { paginationOptionItem } from "../../../helper/paginationHelper";

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

export const getAllDoctorSchedule: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const filter = pick(req.query, DoctorScheduleSelectedQueryItems);
    const paginationOptions = pick(req.query, paginationOptionItem);
    const result = await getAllDoctorScheduleDB(filter, paginationOptions);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Your Schedules fetched successfully!",
      data: result,
    });
  }
);
