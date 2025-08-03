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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const protectRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            //find user
            const user = yield userModel_1.default.findById(decoded).select("-password");
            if (!user) {
                return res.status(401).send({
                    success: false,
                    message: "Theres no user",
                });
            }
            req.user = user;
            next();
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "An error occured",
        });
    }
});
exports.default = protectRoute;
