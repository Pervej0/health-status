import { JwtPayload, Secret } from "jsonwebtoken";
import decodeToken from "../../helper/decodeToken";
import config from "../config";
import CustomError from "../errors/CustomError";
import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new CustomError(
          StatusCodes.UNAUTHORIZED,
          "User is not authorized!"
        );
      }
      const userCredentials = decodeToken(
        token,
        config.ACCESS_TOKEN_SECRET as Secret
      ) as JwtPayload;
      if (roles.length && !roles.includes(userCredentials.role)) {
        throw new CustomError(StatusCodes.FORBIDDEN, "Forbidden To Access!");
      }

      // injecting user with req
      req.user = userCredentials;
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
