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
  let message = "Something Went Wrong!";
  let error = err.message;

  if (err instanceof ZodError) {
    message = "zod validation error occurred!";
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      message =
        "There is a unique constraint violation, a new user cannot be created with this email";
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Validation error occurred";
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: message,
    error,
  });

  next();
};

export default globalErrorHandler;
