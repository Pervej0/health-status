import { RequestHandler } from "express";
import {
  changeUserStatusDB,
  createAdminDB,
  getAllUserDB,
} from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import asyncCatch from "../../../shared/asyncCatch";
import { pick } from "../../../shared/pick";
import { filteredItems, searchedFields } from "./user.constant";
import { paginationOptionItem } from "../../../helper/paginationHelper";

export const getAllUser: RequestHandler = asyncCatch(async (req, res) => {
  const filter = pick(req.query, filteredItems);
  const paginationOption = pick(req.query, paginationOptionItem);

  const result = await getAllUserDB(filter, paginationOption);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Users retrieved scuccessfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const createAdmin: RequestHandler = asyncCatch(async (req, res) => {
  const result = await createAdminDB(req.file, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User Created Successfully!",
    data: result,
  });
});

export const changeUserStatus: RequestHandler = asyncCatch(async (req, res) => {
  const result = await changeUserStatusDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Users status updated scuccessfully!",
    data: result,
  });
});
