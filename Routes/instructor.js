import express from "express";
import formidable from "express-formidable";

const router = express.Router();

import { requireSignin } from "../Middleware/verify.js";
import { imageInstructor, makeInstructor } from "../Controllers/instructor.js";

router.post("/make-instructor", requireSignin, makeInstructor);
router.post(
  "/instructor-image",
  requireSignin,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  imageInstructor
);
export default router;
