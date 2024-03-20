import { Response } from "express";

type TMeta = {
  page: number;
  limit: number;
  total: number;
};

type TJsonData<T> = {
  statusCode: number;
  message: string;
  meta?: TMeta;
  data: T;
};

const sendResponse = <T>(res: Response, jsonData: TJsonData<T>) => {
  res.status(jsonData.statusCode).json({
    success: true,
    message: jsonData.message || "something Went Wrong!",
    meta: jsonData?.meta,
    data: jsonData?.data,
  });
};

export default sendResponse;
