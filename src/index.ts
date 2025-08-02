import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import Connection from "./connect";
import userRouter from "./route/userRoute";
import bookRoute from "./route/bookRoute";

dotenv.config();
const app: Application = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));
app.use(cors());
app.use(morgan("dev"));

Connection();

app.use("/api", userRouter);
app.use("/api", bookRoute);
app.get("/", (req: Request, res: Response) => {
  return res.status(201).send({
    success: true,
    message: "welcome to index page",
  });
});
// const clouding =
//   "https://res.cloudinary.com/devoluyemi/image/upload/v1753958230/xeclgx9urfuphh4l6hmu.svg";
// const myCloud = clouding.split("/").pop()?.split(".")[0];
// console.log(myCloud);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  return console.log(`Connected to port ${PORT}`);
});
