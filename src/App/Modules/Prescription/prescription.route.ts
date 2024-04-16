import express from "express";
import validationChecker from "../../../shared/validationChecker";
import { prescriptionValidationSchema } from "./prescription.validationSchema";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
import { createPrescription } from "./prescription.controller";
const router = express.Router();

router.post(
  "/create-prescription",
  validationChecker(prescriptionValidationSchema),
  auth(userRole.DOCTOR),
  createPrescription
);

const prescriptionRoutes = router;
export default prescriptionRoutes;
