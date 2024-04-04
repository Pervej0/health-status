import express from "express";
import validationChecker from "../../../shared/validationChecker";
import { userRole } from "@prisma/client";
import auth from "../../middleware/auth";
import {
  deleteSinglePatient,
  getAllPatient,
  getSinglePatient,
  softDeleteSinglePatient,
  updateSinglePatient,
} from "./patient.controller";
import { updatePatientValidationSchema } from "./patient.validationSchema";

const router = express.Router();

router.get("/", auth(userRole.ADMIN, userRole.SUPER_ADMIN), getAllPatient);
router.get(
  "/:id",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  getSinglePatient
);
router.patch(
  "/:id",
  validationChecker(updatePatientValidationSchema),
  updateSinglePatient
);
router.delete("/:id", deleteSinglePatient);
router.delete("/soft/:id", softDeleteSinglePatient);

export const patientRoutes = router;
