import { RequestHandler } from "express";
import {
  changeUserStatusDB,
  createAdminDB,
  createDoctorDB,
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
    message: "Users retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const createAdmin: RequestHandler = asyncCatch(async (req, res) => {
  const result = await createAdminDB(req.file, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Admin Created Successfully!",
    data: result,
  });
});

export const createDoctor: RequestHandler = asyncCatch(async (req, res) => {
  console.log(req.file, req.body);
  const result = await createDoctorDB(req.file, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Doctor Created Successfully!",
    data: result,
  });
});

export const changeUserStatus: RequestHandler = asyncCatch(async (req, res) => {
  const result = await changeUserStatusDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Users status updated successfully!",
    data: result,
  });
});
