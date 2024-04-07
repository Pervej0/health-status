import express from "express";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
import {
  createDoctorSchedule,
  deleteDoctorSchedule,
  getAllDoctorSchedule,
  getMySchedule,
} from "./doctorSchedule.controller";
import { getMyScheduleDB } from "./doctorSchedule.service";

const router = express.Router();

router.post(
  "/create-doctor-schedule",
  auth(userRole.DOCTOR, userRole.SUPER_ADMIN),
  createDoctorSchedule
);

router.get("/my-schedules", auth(userRole.DOCTOR), getMySchedule);
router.get(
  "/",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  getAllDoctorSchedule
);
router.delete("/:scheduleId", auth(userRole.DOCTOR), deleteDoctorSchedule);

export const DoctorSchedules = router;
