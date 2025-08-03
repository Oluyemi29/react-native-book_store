"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = exports.Register = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(403).send({
                success: false,
                message: "all field are required",
            });
        }
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "user already exist",
            });
        }
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        const profileimage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;
        const user = yield userModel_1.default.create({
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
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "an error occured",
        });
    }
});
exports.Register = Register;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(403).send({
                success: false,
                message: "all field are required",
            });
        }
        const existingUser = yield userModel_1.default.findOne({ email });
        if (!existingUser) {
            return res.status(400).send({
                success: false,
                message: "user not found",
            });
        }
        const confirmPassword = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!confirmPassword) {
            return res.status(400).send({
                success: false,
                message: "incorrect password",
            });
        }
        const token = jsonwebtoken_1.default.sign({ _id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: "7d" });
        existingUser.password = undefined;
        return res.status(200).send({
            success: true,
            message: "login successfully",
            data: existingUser,
            token,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "An error occured",
        });
    }
});
exports.Login = Login;
