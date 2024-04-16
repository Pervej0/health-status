import { RequestHandler } from "express";
import asyncCatch from "../../../shared/asyncCatch";
import { paymentInitiateDB } from "../Payment/payment.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { createPrescriptionDB } from "./prescription.service";
import { TAuthUser } from "../../interfaces/global";

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
