import { RequestHandler } from "express";
import {
  deleteSingleAdminDB,
  getAllAdminDB,
  getSingleAdminDB,
  softDeleteSingleAdminDB,
  updateSingleAdminDB,
} from "./admin.service";
import { pick } from "../../../shared/pick";
import { paginationOptionItem, selectedQueryItem } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

export const getAllAdmin: RequestHandler = async (req, res, next) => {
  const selectedQuery = pick(req.query, selectedQueryItem);
  const paginationOption = pick(req.query, paginationOptionItem);

  try {
    const result = await getAllAdminDB(selectedQuery, paginationOption);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Users created scuccessfully!",
      meta: result.meta,
      data: result.data,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getSingleAdmin: RequestHandler = async (req, res, next) => {
  try {
    const result = await getSingleAdminDB(req.params.id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Admin is retrieved successfully!",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const updateSingleAdmin: RequestHandler = async (req, res, next) => {
  try {
    const result = await updateSingleAdminDB(req.params.id, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Admin is retrieved successfully!",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSingleAdmin: RequestHandler = async (req, res, next) => {
  try {
    const result = await deleteSingleAdminDB(req.params.id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Admin is deleted successfully!",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const softDeleteSingleAdmin: RequestHandler = async (req, res, next) => {
  try {
    const result = await softDeleteSingleAdminDB(req.params.id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Admin is deleted successfully!",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
