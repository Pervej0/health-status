import express, { NextFunction, Request, Response } from "express";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
import fileUpload from "../../../shared/fileUpload";
import { specialistValidationSchema } from "./specialist.validationSchema";
import { createSpecialist, getAllSpecialists } from "./specialist.controller";
const router = express.Router();

router.get("/", auth(userRole.ADMIN, userRole.SUPER_ADMIN), getAllSpecialists);

router.post(
  "/create-specialist",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  fileUpload.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    const data = specialistValidationSchema.parse(JSON.parse(req.body.data));
    req.body = data;
    return createSpecialist(req, res, next);
  }
);

const specialistRoutes = router;

export default specialistRoutes;
