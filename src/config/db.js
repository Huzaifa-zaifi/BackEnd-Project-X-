import dotenv from "dotenv";
dotenv.config({ path: `./.env` });

import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/my_database";

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDb connected successfully !..")
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
