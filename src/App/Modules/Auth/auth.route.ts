import express from "express";
import { loginUser } from "./auth.controller";
const router = express.Router();

router.post("/", loginUser);

export const authRoutes = router;
