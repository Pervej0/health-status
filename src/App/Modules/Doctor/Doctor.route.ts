import express from "express";

import validationChecker from "../../../shared/validationChecker";
import { userRole } from "@prisma/client";
import auth from "../../middleware/auth";
import { getAllDoctor, updateSingleDoctor } from "./doctor.controller";
import { updateSingleDoctorDB } from "./doctor.service";
import { updateDoctorValidationSchema } from "./doctor.validationSchema";

const router = express.Router();

router.get("/", auth(userRole.ADMIN, userRole.SUPER_ADMIN), getAllDoctor);
// router.get("/:id", getSingleAdmin);
router.patch(
  "/:id",
  validationChecker(updateDoctorValidationSchema),
  updateSingleDoctor
);
// router.delete("/:id", deleteSingleAdmin);
// router.delete("/soft/:id", softDeleteSingleAdmin);

export const doctorRoutes = router;
