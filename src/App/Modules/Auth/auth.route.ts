import express from "express";
import {
  changePassword,
  getRefreshToken,
  loginUser,
  resetPassword,
} from "./auth.controller";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
import { forgetPasswordDB } from "./auth.service";
const router = express.Router();

router.post("/login", loginUser);
router.get("/refresh-token", getRefreshToken);
router.put(
  "/change-password",
  auth(userRole.ADMIN, userRole.DOCTOR, userRole.PATIENT, userRole.SUPER_ADMIN),
  changePassword
);

router.put(
  "/forgot-password",
  // auth(userRole.ADMIN, userRole.DOCTOR, userRole.PATIENT, userRole.SUPER_ADMIN),
  forgetPasswordDB
);
router.get(
  "/reset-password",
  auth(userRole.ADMIN, userRole.DOCTOR, userRole.PATIENT, userRole.SUPER_ADMIN),
  resetPassword
);

export const authRoutes = router;
