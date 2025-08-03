"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModel = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    profileimage: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});
const User = mongoose_1.default.models.users || mongoose_1.default.model("users", userModel);
exports.default = User;
