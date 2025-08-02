import mongoose from "mongoose";

type bookModelProps = {
  title: string;
  caption: string;
  image: string;
  rating: number;
  user: string;
  createdAt: Date;
  updatedAt: Date;
};
const bookModel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Book =
  mongoose.models.books || mongoose.model<bookModelProps>("books", bookModel);

export default Book;
