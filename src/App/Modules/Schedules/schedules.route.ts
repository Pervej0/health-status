import express from "express";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
import {
  createSchedule,
  deleteSchedule,
  getAllSchedules,
  getSingleSchedule,
} from "./schedule.controller";

const router = express.Router();

router.post(
  "/create-schedule",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  createSchedule
);

router.get(
  "/",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN, userRole.DOCTOR),
  getAllSchedules
);

router.get(
  "/:scheduleId",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  getSingleSchedule
);

router.delete(
  "/:scheduleId",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  deleteSchedule
);

export const ScheduleRoutes = router;
