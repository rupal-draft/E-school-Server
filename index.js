import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import "dotenv/config";
import authRoutes from "./Routes/auth.js";
import instructorRoutes from "./Routes/instructor.js";
import courseRoutes from "./Routes/course.js";
import productRoutes from "./Routes/product.js";

import { v2 as cloudinary } from "cloudinary";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("Database Connected Succesfully");
  })
  .catch((err) => console.log("DB CONNECTION ERR => ", err));

app.use("/api", authRoutes);
app.use("/api", instructorRoutes);
app.use("/api", courseRoutes);
app.use("/api", productRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running at port : ${port}`);
});
