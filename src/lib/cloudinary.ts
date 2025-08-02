import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({
  secure: true,
  api_key: process.env.API_KEY as string,
  api_secret: process.env.API_SECRET as string,
  cloud_name: process.env.CLOUD_NAME as string,
});

export default cloudinary;
