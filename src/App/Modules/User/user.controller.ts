import { RequestHandler } from "express";
import { createUserDB, getAllUserDB } from "./user.service";

export const createUser: RequestHandler = async (req, res) => {
  try {
    const result = await createUserDB(req.body);
    res.json({
      success: true,
      message: "Users created scuccessfully!",
      result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Something Went Wrong!",
    });
  }
};

export const getAllUser: RequestHandler = async (req, res) => {
  try {
    const result = await getAllUserDB();
    res.status(200).json({
      success: true,
      message: "Users retrieved scuccessfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Something Went Wrong!",
    });
  }
};
