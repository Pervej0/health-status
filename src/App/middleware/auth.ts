import { Secret } from "jsonwebtoken";
import decodeToken from "../../helper/decodeToken";
import config from "../config";
import CustomError from "../../helper/CustomError";
import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new CustomError(
          StatusCodes.UNAUTHORIZED,
          "User is not authorized!"
        );
      }
      const credentials = decodeToken(
        token,
        config.ACCESS_TOKEN_SECRET as Secret
      );
      console.log(credentials);
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
