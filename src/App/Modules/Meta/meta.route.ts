import express from "express";
import { getAllMetaData } from "./meta.controller";
import auth from "../../middleware/auth";
import { userRole } from "@prisma/client";
const router = express.Router();

router.get(
  "/",
  auth(userRole.SUPER_ADMIN, userRole.ADMIN, userRole.DOCTOR, userRole.PATIENT),
  getAllMetaData
);

const metaRoutes = router;

export default metaRoutes;
