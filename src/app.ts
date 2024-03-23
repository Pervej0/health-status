import express, { Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./App/middleware/globalErrorHandler";
import { RootRoute } from "./App/routes";
import { notFound } from "./App/middleware/notFound";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", RootRoute);
app.use(globalErrorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Welcome to Server Site",
  });
});

app.use(notFound);
export default app;
