import { RequestHandler } from "express";
import sendResponse from "../../../shared/sendResponse";
import asyncCatch from "../../../shared/asyncCatch";
import { pick } from "../../../shared/pick";
import { StatusCodes } from "http-status-codes";
import { DoctorSelectedQueryItems } from "./doctor.constant";
import { paginationOptionItem } from "../../../helper/paginationHelper";
import { getAllDoctorDB, updateSingleDoctorDB } from "./doctor.service";

export const getAllDoctor: RequestHandler = asyncCatch(async (req, res) => {
  const selectedQuery = pick(req.query, DoctorSelectedQueryItems);
  const paginationOption = pick(req.query, paginationOptionItem);

  const result = await getAllDoctorDB(selectedQuery, paginationOption);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Doctor retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

//   export const getSingleAdmin: RequestHandler = asyncCatch(async (req, res) => {
//     const result = await getSingleAdminDB(req.params.id);
//     sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       message: "Admin is retrieved successfully!",
//       data: result,
//     });
//   });

export const updateSingleDoctor: RequestHandler = asyncCatch(
  async (req, res) => {
    const result = await updateSingleDoctorDB(req.params.id, req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Doctor updated successfully!",
      data: result,
    });
  }
);

//   export const deleteSingleAdmin: RequestHandler = asyncCatch(
//     async (req, res) => {
//       const result = await deleteSingleAdminDB(req.params.id);

//       sendResponse(res, {
//         statusCode: StatusCodes.OK,
//         message: "Admin is deleted successfully!",
//         data: result,
//       });
//     }
//   );

//   export const softDeleteSingleAdmin: RequestHandler = asyncCatch(
//     async (req, res) => {
//       const result = await softDeleteSingleAdminDB(req.params.id);
//       sendResponse(res, {
//         statusCode: StatusCodes.OK,
//         message: "Admin is deleted successfully!",
//         data: result,
//       });
//     }
//   );
