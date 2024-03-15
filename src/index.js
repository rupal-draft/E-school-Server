import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import "dotenv/config";
import authRoutes from "./../Routes/auth.js";
import instructorRoutes from "./../Routes/instructor.js";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("Database Connected Succesfully");
  })
  .catch((err) => console.log("DB CONNECTION ERR => ", err));

app.use("/api", authRoutes);
app.use("/api", instructorRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running at port : ${port}`);
});
