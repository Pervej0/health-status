import express, { NextFunction, Request, Response } from "express";
import { createAdmin, getAllUser } from "./user.controller";
import fileUpload from "../../../shared/fileUpload";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
import { AdminValidationSchema } from "./user.validationSchema";
import validationChecker from "../../../shared/validationChecker";
const router = express.Router();

router.post(
  "/",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  fileUpload.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    const data = AdminValidationSchema.parse(JSON.parse(req.body.data));
    req.body = data;
    // validationChecker(AdminValidationSchema);
    return createAdmin(req, res, next);
  }
);
router.get("/", getAllUser);

export const userRoute = router;
