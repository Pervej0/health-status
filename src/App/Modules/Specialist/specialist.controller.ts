import { Request, RequestHandler } from "express";
import asyncCatch from "../../../shared/asyncCatch";
import { updateProfileDB } from "../User/user.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import {
  createSpecialistDB,
  deleteSpecialistDB,
  getAllSpecialistsDB,
} from "./specialist.service";

export const createSpecialist: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const result = await createSpecialistDB(req.file, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Specialist Created successfully!",
      data: result,
    });
  }
);

export const getAllSpecialists: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const result = await getAllSpecialistsDB();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Specialist Created successfully!",
      data: result,
    });
  }
);

export const deleteSpecialist: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const result = await deleteSpecialistDB(req.params.specialistId);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Specialist deleted successfully!",
      data: result,
    });
  }
);
