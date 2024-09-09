import express from "express";
import { configDotenv } from "dotenv";

import connectDB from "./config/db.js";

const app = express();
configDotenv();
connectDB();

app.listen(process.env.PORT || 2000, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
