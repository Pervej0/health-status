import express from "express";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
import {
  createAppointment,
  getAllAppointment,
  getMyAppointment,
  updateAppointmentStatus,
} from "./appointment.controller";
import validationChecker from "../../../shared/validationChecker";
import { appointmentValidationSchema } from "./appointment.validationSchema";

const router = express.Router();

router.get(
  "/my-appointment",
  auth(userRole.PATIENT, userRole.DOCTOR),
  getMyAppointment
);
router.get("/", auth(userRole.ADMIN, userRole.SUPER_ADMIN), getAllAppointment);
router.post(
  "/create-appointment",
  validationChecker(appointmentValidationSchema),
  auth(userRole.PATIENT),
  createAppointment
);
router.patch(
  "/status/:appointmentId",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),
  updateAppointmentStatus
);

export const appointmentRoutes = router;
