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
import { userRole } from "@prisma/client";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/", auth(userRole.ADMIN, userRole.SUPER_ADMIN), getAllAdmin);
router.get("/:id", getSingleAdmin);
router.patch(
  "/:id",
  validationChecker(updateAdminValidationSchema),
  updateSingleAdmin
);
router.delete("/:id", deleteSingleAdmin);
router.delete("/soft/:id", softDeleteSingleAdmin);

export const adminRoute = router;
