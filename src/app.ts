import express, { Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./App/middleware/globalErrorHandler";
import { RootRoute } from "./App/routes";
import { notFound } from "./App/middleware/notFound";
import cookieParser from "cookie-parser";
import { deleteUnPaidAppointmentDB } from "./App/Modules/Appointment/appointment.service";
import cron from "node-cron";
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", RootRoute);
app.use(globalErrorHandler);

// cancel appointment after 30minutes
cron.schedule("* * * * *", () => {
  try {
    deleteUnPaidAppointmentDB();
  } catch (err) {
    console.log(err);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Welcome to Server Site",
  });
});

app.use(notFound);
export default app;
