import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const notFound = (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    statusCode: StatusCodes.NOT_FOUND,
    message: "API is not found",
    error: {
      path: req.originalUrl,
      message: "The route you are searching does not exist!",
    },
  });
};
