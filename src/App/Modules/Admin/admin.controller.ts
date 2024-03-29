import { RequestHandler } from "express";
import {
  deleteSingleAdminDB,
  getAllAdminDB,
  getSingleAdminDB,
  softDeleteSingleAdminDB,
  updateSingleAdminDB,
} from "./admin.service";
import { pick } from "../../../shared/pick";
import { selectedQueryItem } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import asyncCatch from "../../../shared/asyncCatch";
import { paginationOptionItem } from "../../../helper/paginationHelper";

export const getAllAdmin: RequestHandler = asyncCatch(async (req, res) => {
  const selectedQuery = pick(req.query, selectedQueryItem);
  const paginationOption = pick(req.query, paginationOptionItem);

  const result = await getAllAdminDB(selectedQuery, paginationOption);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Users created scuccessfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const getSingleAdmin: RequestHandler = asyncCatch(async (req, res) => {
  const result = await getSingleAdminDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Admin is retrieved successfully!",
    data: result,
  });
});

export const updateSingleAdmin: RequestHandler = asyncCatch(
  async (req, res) => {
    const result = await updateSingleAdminDB(req.params.id, req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Admin is retrieved successfully!",
      data: result,
    });
  }
);

export const deleteSingleAdmin: RequestHandler = asyncCatch(
  async (req, res) => {
    const result = await deleteSingleAdminDB(req.params.id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Admin is deleted successfully!",
      data: result,
    });
  }
);

export const softDeleteSingleAdmin: RequestHandler = asyncCatch(
  async (req, res) => {
    const result = await softDeleteSingleAdminDB(req.params.id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Admin is deleted successfully!",
      data: result,
    });
  }
);
