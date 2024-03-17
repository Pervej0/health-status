import express from "express";
import { getAllAdmin } from "./admin.controller";
const router = express.Router();

router.get("/", getAllAdmin);

export const adminRoute = router;
