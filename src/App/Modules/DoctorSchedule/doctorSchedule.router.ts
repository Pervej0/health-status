import express from "express";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
import { createDoctorSchedule } from "./doctorSchedule.controller";

const router = express.Router();

router.post(
  "/create-doctor-schedule",
  auth(userRole.DOCTOR, userRole.SUPER_ADMIN),
  createDoctorSchedule
);

export const DoctorSchedules = router;
