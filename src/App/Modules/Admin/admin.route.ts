import express from "express";
import {
  deleteSingleAdmin,
  getAllAdmin,
  getSingleAdmin,
  softDeleteSingleAdmin,
  updateSingleAdmin,
} from "./admin.controller";
const router = express.Router();

router.get("/", getAllAdmin);
router.get("/:id", getSingleAdmin);
router.patch("/:id", updateSingleAdmin);
router.delete("/:id", deleteSingleAdmin);
router.delete("/soft/:id", softDeleteSingleAdmin);

export const adminRoute = router;
