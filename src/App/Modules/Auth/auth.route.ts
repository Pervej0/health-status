import express from "express";
import { getRefreshToken, loginUser } from "./auth.controller";
const router = express.Router();

router.post("/login", loginUser);
router.get("/refresh-token", getRefreshToken);

export const authRoutes = router;
