import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../model/userModel";
import dotenv from "dotenv";

interface AuthEXt extends Request {
  user?: {
    _id: string;
    email: string;
    username: string;
    profileimage: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

dotenv.config();
const protectRoute = async (
  req: AuthEXt,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "Your headers is empty",
      });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "token is missing",
      });
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY as string);

      //find user
      const user = await User.findById(decoded).select("-password");
      if (!user) {
        return res.status(401).send({
          success: false,
          message: "Theres no user",
        });
      }
      req.user = user;
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "An error occured",
    });
  }
};

export default protectRoute;
