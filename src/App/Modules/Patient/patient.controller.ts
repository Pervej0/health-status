import { RequestHandler } from "express";
import asyncCatch from "../../../shared/asyncCatch";
import { pick } from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { PatientSelectedQueryItems } from "./patient.constant";
import { paginationOptionItem } from "../../../helper/paginationHelper";
import {
  deleteSinglePatientDB,
  getAllPatientDB,
  getSinglePatientDB,
  softDeleteSinglePatientDB,
  updateSinglePatientDB,
} from "./patient.service";

export const getAllPatient: RequestHandler = asyncCatch(async (req, res) => {
  const selectedQuery = pick(req.query, PatientSelectedQueryItems);
  const paginationOption = pick(req.query, paginationOptionItem);

  const result = await getAllPatientDB(selectedQuery, paginationOption);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Patients retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const getSinglePatient: RequestHandler = asyncCatch(async (req, res) => {
  const result = await getSinglePatientDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Patient is retrieved successfully!",
    data: result,
  });
});

export const updateSinglePatient: RequestHandler = asyncCatch(
  async (req, res) => {
    const result = await updateSinglePatientDB(req.params.id, req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Patient updated successfully!",
      data: result,
    });
  }
);

export const deleteSinglePatient: RequestHandler = asyncCatch(
  async (req, res) => {
    const result = await deleteSinglePatientDB(req.params.id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Patient is deleted successfully!",
      data: result,
    });
  }
);

export const softDeleteSinglePatient: RequestHandler = asyncCatch(
  async (req, res) => {
    const result = await softDeleteSinglePatientDB(req.params.id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Patient is deleted successfully!",
      data: result,
    });
  }
);
