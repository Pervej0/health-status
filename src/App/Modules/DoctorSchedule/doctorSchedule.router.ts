import express from "express";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
import {
  createDoctorSchedule,
  getAllDoctorSchedule,
} from "./doctorSchedule.controller";

const router = express.Router();

router.post(
  "/create-doctor-schedule",
  auth(userRole.DOCTOR, userRole.SUPER_ADMIN),
  createDoctorSchedule
);

router.get("/", auth(userRole.DOCTOR), getAllDoctorSchedule);

export const DoctorSchedules = router;
