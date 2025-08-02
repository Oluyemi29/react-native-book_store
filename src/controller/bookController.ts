import { Request, Response } from "express";
import Book from "../model/bookModel";
import cloudinary from "../lib/cloudinary";

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

export const CreateBook = async (req: AuthEXt, res: Response) => {
  try {
    const userId = req.user?._id as string;
    const { title, caption, image, rating } = req.body;
    if (!title || !caption || !image || !rating) {
      return res.status(400).send({
        success: false,
        message: "All field are required",
      });
    }
    //upload the image
    const request = await cloudinary.uploader.upload(image);
    const ImageUrl = request.secure_url;
    // const publicId = request.public_id;
    const book = await Book.create({
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
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "An error occured",
    });
  }
};

export const GetBooks = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const books = await Book.find()
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
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "An error occured",
    });
  }
};

export const DeleteBook = async (req: AuthEXt, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params;
    console.log(typeof user?._id, id);

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
    const book = await Book.findById(id);
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
    if (
      book &&
      book.user.toString() === user._id.toString() &&
      book.image.includes("cloudinary")
    ) {
      const publicId = book.image.split("/").pop()?.split(".")[0] as string;
      await cloudinary.uploader.destroy(publicId);

      await Book.findByIdAndDelete(id);
      return res.status(200).send({
        success: true,
        message: "book deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "An error occured",
    });
  }
};

export const RecommendedBook = async (req: AuthEXt, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "unauthourize access",
      });
    }
    const recommendedBook = await Book.find({ user: user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).send({
      success: true,
      message: "recommended book gotten successfully",
      recommendedBook,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "An error occured",
    });
  }
};
