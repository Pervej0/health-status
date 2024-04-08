import express from "express";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
import { createAppointment, getMyAppointment } from "./appointment.controller";

const router = express.Router();

router.get("/", auth(userRole.PATIENT, userRole.DOCTOR), getMyAppointment);
router.post("/create-appointment", auth(userRole.PATIENT), createAppointment);

export const appointmentRoutes = router;
