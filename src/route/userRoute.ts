import express from "express";
import { Login, Register } from "../controller/userController";

const userRouter = express.Router();

userRouter.post("/register", Register);
userRouter.post("/login", Login);

export default userRouter;
