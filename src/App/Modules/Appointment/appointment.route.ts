import express from "express";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
import { createAppointment } from "./appointment.controller";

const router = express.Router();

router.post("/create-appointment", auth(userRole.PATIENT), createAppointment);

export const appointmentRoutes = router;
