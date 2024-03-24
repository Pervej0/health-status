import express from "express";
import {
  changePassword,
  forgetPassword,
  getRefreshToken,
  loginUser,
} from "./auth.controller";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
const router = express.Router();

router.post("/login", loginUser);
router.get("/refresh-token", getRefreshToken);
router.get(
  "/change-password",
  auth(userRole.ADMIN, userRole.DOCTOR, userRole.PATIENT, userRole.SUPER_ADMIN),
  changePassword
);

router.get(
  "/forget-password",
  auth(userRole.ADMIN, userRole.DOCTOR, userRole.PATIENT, userRole.SUPER_ADMIN),
  forgetPassword
);

export const authRoutes = router;
