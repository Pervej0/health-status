import { RequestHandler } from "express";
import sendResponse from "../../../shared/sendResponse";
import asyncCatch from "../../../shared/asyncCatch";
import { pick } from "../../../shared/pick";
import { StatusCodes } from "http-status-codes";
import { DoctorSelectedQueryItems } from "./doctor.constant";
import { paginationOptionItem } from "../../../helper/paginationHelper";
import {
  deleteSingleDoctorDB,
  getAllDoctorDB,
  getSingleDoctorDB,
  softDeleteSingleDoctorDB,
  updateSingleDoctorDB,
} from "./doctor.service";

export const getAllDoctor: RequestHandler = asyncCatch(async (req, res) => {
  const selectedQuery = pick(req.query, DoctorSelectedQueryItems);
  const paginationOption = pick(req.query, paginationOptionItem);

  const result = await getAllDoctorDB(selectedQuery, paginationOption);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Doctors retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const getSingleDoctor: RequestHandler = asyncCatch(async (req, res) => {
  const result = await getSingleDoctorDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Doctor is retrieved successfully!",
    data: result,
  });
});

export const updateSingleDoctor: RequestHandler = asyncCatch(
  async (req, res) => {
    const result = await updateSingleDoctorDB(req.params.id, req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Doctor updated successfully!",
      data: result,
    });
  }
);

export const deleteSingleDoctor: RequestHandler = asyncCatch(
  async (req, res) => {
    const result = await deleteSingleDoctorDB(req.params.id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Doctor is deleted successfully!",
      data: result,
    });
  }
);

export const softDeleteSingleDoctor: RequestHandler = asyncCatch(
  async (req, res) => {
    const result = await softDeleteSingleDoctorDB(req.params.id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Doctor is deleted successfully!",
      data: result,
    });
  }
);
