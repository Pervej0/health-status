import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validationChecker = (validateData: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validateData.parseAsync({
        body: req.body,
      });
      return next();
    } catch (err) {
      next(err);
    }
  };
};

export default validationChecker;
