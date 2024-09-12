import mongoose from "mongoose";

import congif from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(congif?.mongo_db_url);

    console.log("MongoDB connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
