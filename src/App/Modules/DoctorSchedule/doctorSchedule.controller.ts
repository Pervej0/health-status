import { Request, RequestHandler } from "express";
import asyncCatch from "../../../shared/asyncCatch";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import {
  createDoctorScheduleDB,
  deleteDoctorScheduleDB,
  getAllDoctorScheduleDB,
  getMyScheduleDB,
} from "./doctorSchedule.service";
import { pick } from "../../../shared/pick";
import { DoctorScheduleSelectedQueryItems } from "./doctorSchedule.constant";
import { paginationOptionItem } from "../../../helper/paginationHelper";
import { TAuthUser } from "../../interfaces/global";

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

export const getMySchedule: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const filter = pick(req.query, DoctorScheduleSelectedQueryItems);
    const paginationOptions = pick(req.query, paginationOptionItem);
    const result = await getMyScheduleDB(filter, paginationOptions, req.user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Your Schedules fetched successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const getAllDoctorSchedule: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const filter = pick(req.query, [
      ...DoctorScheduleSelectedQueryItems,
      "searchTerm",
    ]);
    const paginationOptions = pick(req.query, paginationOptionItem);
    const result = await getAllDoctorScheduleDB(filter, paginationOptions);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "All doctor Schedules fetched successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const deleteDoctorSchedule: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const result = await deleteDoctorScheduleDB(
      req.user,
      req.params.scheduleId
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Your Schedule deleted successfully!",
      data: result,
    });
  }
);
