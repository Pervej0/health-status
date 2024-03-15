import express, { Request, Response } from "express";
import cors from "cors";
import { userRoute } from "./App/Modules/User/user.route";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRoute);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Welcome to Server Site",
  });
});

export default app;
