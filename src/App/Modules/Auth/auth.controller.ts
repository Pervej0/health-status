import { RequestHandler } from "express";
import asyncCatch from "../../../shared/asyncCatch";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { getRefreshTokenDB, loginUserDB } from "./auth.service";

export const loginUser: RequestHandler = asyncCatch(async (req, res) => {
  const result = await loginUserDB(req.body);
  res.cookie("refreshToken", result.refreshToken);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User Logged in successfully!",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

export const getRefreshToken: RequestHandler = asyncCatch(async (req, res) => {
  const result = await getRefreshTokenDB(req.cookies.refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User Accesstoken retrieved successfully!",
    data: result,
  });
});
