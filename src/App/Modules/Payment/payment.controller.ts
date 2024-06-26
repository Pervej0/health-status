import { RequestHandler } from "express";
import asyncCatch from "../../../shared/asyncCatch";
import { paymentInitiateDB, validatePaymentDB } from "./payment.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

export const paymentInitiate: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const result = await paymentInitiateDB(req.params.appointmentId);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Payment initiated successfully!",
      data: result,
    });
  }
);

export const validatePayment: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const result = await validatePaymentDB(req.query);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Payment successfully validated!",
      data: result,
    });
  }
);
