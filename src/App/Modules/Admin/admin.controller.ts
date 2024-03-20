import { RequestHandler } from "express";
import {
  deleteSingleAdminDB,
  getAllAdminDB,
  getSingleAdminDB,
  softDeleteSingleAdminDB,
  updateSingleAdminDB,
} from "./admin.service";
import { pick } from "../../../shared/pick";
import { paginationOptionItem, selectedQueryItem } from "./admin.constant";

export const getAllAdmin: RequestHandler = async (req, res) => {
  const selectedQuery = pick(req.query, selectedQueryItem);
  const paginationOption = pick(req.query, paginationOptionItem);

  try {
    const result = await getAllAdminDB(selectedQuery, paginationOption);
    res.json({
      success: true,
      message: "Users created scuccessfully!",
      meta: result.meta,
      data: result.data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Something Went Wrong!",
      err,
    });
  }
};

export const getSingleAdmin: RequestHandler = async (req, res) => {
  try {
    const result = await getSingleAdminDB(req.params.id);
    res.status(200).json({
      success: true,
      message: "Admin is retrieved successfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: true,
      message: err.message || "Something Went wrong!",
      err: err,
    });
  }
};

export const updateSingleAdmin: RequestHandler = async (req, res) => {
  try {
    const result = await updateSingleAdminDB(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Admin is retrieved successfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: true,
      message: err.message || "Something Went wrong!",
      err: err,
    });
  }
};

export const deleteSingleAdmin: RequestHandler = async (req, res) => {
  try {
    const result = await deleteSingleAdminDB(req.params.id);
    res.status(200).json({
      success: true,
      message: "Admin is deleted successfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: true,
      message: err.message || "Something Went wrong!",
      err: err,
    });
  }
};

export const softDeleteSingleAdmin: RequestHandler = async (req, res) => {
  try {
    const result = await softDeleteSingleAdminDB(req.params.id);
    res.status(200).json({
      success: true,
      message: "Admin is deleted successfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: true,
      message: err.message || "Something Went wrong!",
      err: err,
    });
  }
};
