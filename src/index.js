import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
mongoose.connect(process.env.DATABASE).then(() => {
  console.log("Database Connected Succesfully");
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running at port : ${port}`);
});
