import mongoose from "mongoose";

const Connection = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_DB as string);
    console.log(`connected to ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

export default Connection;
