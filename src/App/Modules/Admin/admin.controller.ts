import { RequestHandler } from "express";
import { getAllAdminDB } from "./admin.service";
import { pick } from "../../../shared/pick";

export const getAllAdmin: RequestHandler = async (req, res) => {
  const selectedQuery = pick(req.query, ["searchTerm", "name", "email"]);
  console.log(selectedQuery, "er");
  try {
    const result = await getAllAdminDB(selectedQuery);
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
