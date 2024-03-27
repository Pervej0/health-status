import { RequestHandler } from "express";
import { createAdminDB, getAllUserDB } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

export const createAdmin: RequestHandler = async (req, res) => {
  const result = await createAdminDB(req.file, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User Created Successfully!!!!!!!!!!!",
    data: result,
  });
};

export const getAllUser: RequestHandler = async (req, res) => {
  const result = await getAllUserDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Users retrieved scuccessfully!",
    data: result,
  });
};
