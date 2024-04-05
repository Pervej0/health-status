import express from "express";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
import { createSchedule } from "./schedule.controller";

const router = express.Router();

router.post(
  "/create-schedule",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  createSchedule
);

export const ScheduleRoutes = router;
