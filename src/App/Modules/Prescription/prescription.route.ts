import express from "express";
import validationChecker from "../../../shared/validationChecker";
import { prescriptionValidationSchema } from "./prescription.validationSchema";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
import {
  createPrescription,
  getAllPrescription,
  getMyPrescription,
} from "./prescription.controller";
const router = express.Router();

router.get("/my-prescription", auth(userRole.PATIENT), getMyPrescription);
router.get("/", auth(userRole.ADMIN, userRole.SUPER_ADMIN), getAllPrescription);

router.post(
  "/create-prescription",
  validationChecker(prescriptionValidationSchema),
  auth(userRole.DOCTOR),
  createPrescription
);

const prescriptionRoutes = router;
export default prescriptionRoutes;
