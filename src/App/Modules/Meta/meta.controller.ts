import { RequestHandler } from "express";
import { getSinglePatientDB } from "../Patient/patient.service";
import asyncCatch from "../../../shared/asyncCatch";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import { getAllMetaDataDB } from "./meta.service";

export const getAllMetaData: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const result = await getAllMetaDataDB(req.user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Meta data retrieved successfully!",
      data: result,
    });
  }
);
