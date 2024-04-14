import express from "express";
import { paymentInitiate } from "./payment.controller";
const router = express.Router();

router.post("/init/:appointmentId", paymentInitiate);

const paymentRoutes = router;
export default paymentRoutes;
