import express from "express";

import validationChecker from "../../../shared/validationChecker";
import { userRole } from "@prisma/client";
import auth from "../../middleware/auth";
import {
  deleteSingleDoctor,
  getAllDoctor,
  getSingleDoctor,
  softDeleteSingleDoctor,
  updateSingleDoctor,
} from "./doctor.controller";
import { updateDoctorValidationSchema } from "./doctor.validationSchema";

const router = express.Router();
auth(userRole.ADMIN, userRole.SUPER_ADMIN), router.get("/", getAllDoctor);
router.get("/:id", getSingleDoctor);
router.patch(
  "/:id",
  validationChecker(updateDoctorValidationSchema),
  updateSingleDoctor
);
router.delete("/:id", deleteSingleDoctor);
router.delete("/soft/:id", softDeleteSingleDoctor);

export const doctorRoutes = router;
