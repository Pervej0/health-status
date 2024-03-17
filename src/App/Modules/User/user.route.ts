import express from "express";
import { createUser, getAllUser } from "./user.controller";
const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUser);

export const userRoute = router;
