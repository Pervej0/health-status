import express from "express";
import validationChecker from "../../../shared/validationChecker";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
import { createReview, getAllReviews } from "./review.controller";
import { reviewValidationSchema } from "./review.validationSchema";

const router = express.Router();

// router.get("/my-prescription", auth(userRole.PATIENT), getMyPrescription);
// router.get("/", auth(userRole.ADMIN, userRole.SUPER_ADMIN), getAllPrescription);

router.post(
  "/create-review",
  validationChecker(reviewValidationSchema),
  auth(userRole.PATIENT),
  createReview
);
router.get("/", auth(userRole.ADMIN, userRole.SUPER_ADMIN), getAllReviews);

const reviewRoutes = router;
export default reviewRoutes;
