import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = StatusCodes.BAD_REQUEST;
  let message = err.message || "Something Went Wrong!";
  let error = err;

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    statusCode,
    success: false,
    message: message,
    error,
  });

  next();
};

export default globalErrorHandler;
