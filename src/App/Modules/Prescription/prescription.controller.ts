import { RequestHandler } from "express";
import asyncCatch from "../../../shared/asyncCatch";
import { paymentInitiateDB } from "../Payment/payment.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import {
  createPrescriptionDB,
  getAllPrescriptionDB,
  getMyPrescriptionDB,
} from "./prescription.service";
import { TAuthUser } from "../../interfaces/global";
import { pick } from "../../../shared/pick";
import { paginationOptionItem } from "../../../helper/paginationHelper";
import { prescriptionSelectedQueryFields } from "./prescription.constant";

export const createPrescription: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const result = await createPrescriptionDB(req.user, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Prescription created successfully!",
      data: result,
    });
  }
);

export const getMyPrescription: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const paginationOption = pick(req.query, paginationOptionItem);
    const result = await getMyPrescriptionDB(req.user, paginationOption);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Your prescription retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const getAllPrescription: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const filterOptions = pick(req.query, prescriptionSelectedQueryFields);
    const paginationOption = pick(req.query, paginationOptionItem);
    const result = await getAllPrescriptionDB(filterOptions, paginationOption);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "prescriptions retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);
