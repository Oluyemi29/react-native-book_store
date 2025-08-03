"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookController_1 = require("../controller/bookController");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const bookRoute = express_1.default.Router();
bookRoute.post("/createbook", auth_middleware_1.default, bookController_1.CreateBook);
bookRoute.get("/allbooks", auth_middleware_1.default, bookController_1.GetBooks);
bookRoute.delete("/deletebook/:id", auth_middleware_1.default, bookController_1.DeleteBook);
bookRoute.get("/recommendedbooks", auth_middleware_1.default, bookController_1.RecommendedBook);
exports.default = bookRoute;
