"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const connect_1 = __importDefault(require("./connect"));
const userRoute_1 = __importDefault(require("./route/userRoute"));
const bookRoute_1 = __importDefault(require("./route/bookRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb" }));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
(0, connect_1.default)();
app.use("/api", userRoute_1.default);
app.use("/api", bookRoute_1.default);
app.get("/", (req, res) => {
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
