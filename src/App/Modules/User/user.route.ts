import express, { NextFunction, Request, Response } from "express";
import {
  changeUserStatus,
  createAdmin,
  createDoctor,
  getAllUser,
} from "./user.controller";
import fileUpload from "../../../shared/fileUpload";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
import {
  AdminValidationSchema,
  DoctorValidationSchema,
} from "./user.validationSchema";
import validationChecker from "../../../shared/validationChecker";
const router = express.Router();

router.get("/", auth(userRole.SUPER_ADMIN, userRole.ADMIN), getAllUser);

router.post(
  "/create-admin",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  fileUpload.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    const data = AdminValidationSchema.parse(JSON.parse(req.body.data));
    req.body = data;
    return createAdmin(req, res, next);
  }
);
router.post(
  "/create-doctor",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  fileUpload.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    const data = DoctorValidationSchema.parse(JSON.parse(req.body.data));
    req.body = data;
    return createDoctor(req, res, next);
  }
);

router.patch("/:id", changeUserStatus);

export const userRoute = router;
