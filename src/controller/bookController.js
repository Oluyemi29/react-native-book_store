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
exports.RecommendedBook = exports.DeleteBook = exports.GetBooks = exports.CreateBook = void 0;
const bookModel_1 = __importDefault(require("../model/bookModel"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const CreateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { title, caption, image, rating } = req.body;
        if (!title || !caption || !image || !rating) {
            return res.status(400).send({
                success: false,
                message: "All field are required",
            });
        }
        //upload the image
        const request = yield cloudinary_1.default.uploader.upload(image);
        const ImageUrl = request.secure_url;
        // const publicId = request.public_id;
        const book = yield bookModel_1.default.create({
            title,
            caption,
            image: ImageUrl,
            rating,
            user: userId,
        });
        return res.status(200).send({
            success: true,
            message: "Book created successfully",
            book,
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
exports.CreateBook = CreateBook;
const GetBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const books = yield bookModel_1.default.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "_id username email profileimage");
        return res.status(200).send({
            success: true,
            message: "all book gotten successfully",
            books,
            currentPage: page,
            totalBooks: books.length,
            totalPages: Math.ceil(books.length / limit),
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
exports.GetBooks = GetBooks;
const DeleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        const { id } = req.params;
        console.log(typeof (user === null || user === void 0 ? void 0 : user._id), id);
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "unauthourize access",
            });
        }
        if (!id) {
            return res.status(400).send({
                success: false,
                message: "all field are required",
            });
        }
        const book = yield bookModel_1.default.findById(id);
        if (!book) {
            return res.status(400).send({
                success: false,
                message: "Book not found",
            });
        }
        if (book.user.toString() !== user._id.toString()) {
            return res.status(400).send({
                success: false,
                message: "You are not authourize to delete this book",
            });
        }
        if (book &&
            book.user.toString() === user._id.toString() &&
            book.image.includes("cloudinary")) {
            const publicId = (_a = book.image.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0];
            yield cloudinary_1.default.uploader.destroy(publicId);
            yield bookModel_1.default.findByIdAndDelete(id);
            return res.status(200).send({
                success: true,
                message: "book deleted successfully",
            });
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
exports.DeleteBook = DeleteBook;
const RecommendedBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "unauthourize access",
            });
        }
        const recommendedBook = yield bookModel_1.default.find({ user: user._id }).sort({
            createdAt: -1,
        });
        return res.status(200).send({
            success: true,
            message: "recommended book gotten successfully",
            recommendedBook,
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
exports.RecommendedBook = RecommendedBook;
