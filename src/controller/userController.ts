import { Request, Response } from "express";
import User from "../model/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(403).send({
        success: false,
        message: "all field are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "user already exist",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const profileimage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;
    const user = await User.create({
      username,
      email,
      password: hashPassword,
      profileimage,
    });
    user.password = undefined;
    return res.status(200).send({
      success: true,
      message: "user registered successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "an error occured",
    });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).send({
        success: false,
        message: "all field are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).send({
        success: false,
        message: "user not found",
      });
    }
    const confirmPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "incorrect password",
      });
    }
    const token = jwt.sign(
      { _id: existingUser._id },
      process.env.SECRET_KEY as string,
      { expiresIn: "7d" }
    );
    existingUser.password = undefined;
    return res.status(200).send({
      success: true,
      message: "login successfully",
      data: existingUser,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "An error occured",
    });
  }
};
