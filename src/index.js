import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
// import csrf from "csurf";
import "dotenv/config";
import authRoutes from "./../Routes/auth.js";

const app = express();
// const csrfProtection = csrf({ cookie: true });

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(morgan("dev"));
// app.use(csrfProtection);

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("Database Connected Succesfully");
  })
  .catch((err) => console.log("DB CONNECTION ERR => ", err));

app.use("/api", authRoutes);
// app.get("/api/csrf-token", (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running at port : ${port}`);
});
