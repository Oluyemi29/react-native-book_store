import express from "express";
import {
  CreateBook,
  DeleteBook,
  GetBooks,
  RecommendedBook,
} from "../controller/bookController";
import protectRoute from "../middleware/auth.middleware";

const bookRoute = express.Router();

bookRoute.post("/createbook", protectRoute, CreateBook);
bookRoute.get("/allbooks", protectRoute, GetBooks);
bookRoute.delete("/deletebook/:id", protectRoute, DeleteBook);
bookRoute.get("/recommendedbooks", protectRoute, RecommendedBook);

export default bookRoute;
