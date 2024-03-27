import express from "express";
import { createUser, getAllUser } from "./user.controller";
import upload from "../../../shared/fileUpload";
const router = express.Router();

router.post("/", upload.single("file"), createUser);
router.get("/", getAllUser);

export const userRoute = router;
