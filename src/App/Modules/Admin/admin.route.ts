import express from "express";
import {
  deleteSingleAdmin,
  getAllAdmin,
  getSingleAdmin,
  softDeleteSingleAdmin,
  updateSingleAdmin,
} from "./admin.controller";
import validationChecker from "../../../shared/validationChecker";
import { updateAdminValidationSchema } from "./validation.schema";

const router = express.Router();

router.get("/", getAllAdmin);
router.get("/:id", getSingleAdmin);
router.patch(
  "/:id",
  validationChecker(updateAdminValidationSchema),
  updateSingleAdmin
);
router.delete("/:id", deleteSingleAdmin);
router.delete("/soft/:id", softDeleteSingleAdmin);

export const adminRoute = router;
