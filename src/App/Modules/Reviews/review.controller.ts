import { RequestHandler } from "express";
import asyncCatch from "../../../shared/asyncCatch";
import { createPrescriptionDB } from "../Prescription/prescription.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { CreateReviewDB, getAllReviewsDB } from "./review.service";
import { pick } from "../../../shared/pick";
import { paginationOptionItem } from "../../../helper/paginationHelper";
import { reviewSelectedQueryFields } from "./review.constant";

export const createReview: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const result = await CreateReviewDB(req.user, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Review has given successfully!",
      data: result,
    });
  }
);

export const getAllReviews: RequestHandler = asyncCatch(
  async (req: any, res) => {
    const filterOptions = pick(req.query, reviewSelectedQueryFields);
    const paginationOption = pick(req.query, paginationOptionItem);
    const result = await getAllReviewsDB(filterOptions, paginationOption);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Reviews retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);
