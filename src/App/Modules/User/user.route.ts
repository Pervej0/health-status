import express, { NextFunction, Request, Response } from "express";
import {
  changeUserStatus,
  createAdmin,
  createDoctor,
  createPatient,
  getAllUser,
  getMe,
} from "./user.controller";
import fileUpload from "../../../shared/fileUpload";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
import {
  AdminValidationSchema,
  DoctorValidationSchema,
  patientValidationSchema,
} from "./user.validationSchema";
const router = express.Router();

router.get("/", auth(userRole.SUPER_ADMIN, userRole.ADMIN), getAllUser);
router.get(
  "/me",
  auth(userRole.SUPER_ADMIN, userRole.ADMIN, userRole.DOCTOR, userRole.PATIENT),
  getMe
);

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
router.post(
  "/create-patient",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN, userRole.PATIENT, userRole.DOCTOR),
  fileUpload.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    const data = patientValidationSchema.parse(JSON.parse(req.body.data));
    req.body = data;
    return createPatient(req, res, next);
  }
);

router.patch("/:id", changeUserStatus);

export const userRoute = router;
