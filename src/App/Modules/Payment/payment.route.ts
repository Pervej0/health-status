import express from "express";
import { paymentInitiate, validatePayment } from "./payment.controller";
const router = express.Router();

router.post("/init/:appointmentId", paymentInitiate);
router.get("/ipn", validatePayment);

const paymentRoutes = router;
export default paymentRoutes;
