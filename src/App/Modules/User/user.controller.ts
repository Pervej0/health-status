import { RequestHandler } from "express";
import { createUserDB } from "./user.service";

export const createUser: RequestHandler = async (req, res) => {
  const result = await createUserDB(req.body);
  res.json({
    result,
  });
};
