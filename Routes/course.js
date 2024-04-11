import express from "express";
import formidable from "express-formidable";

const router = express.Router();

import { isInstructor, requireSignin } from "../Middleware/verify.js";
import {
  addLesson,
  createCourses,
  deleteLesson,
  imageCourse,
  readCourse,
  removeImage,
  removeVideo,
  videoUpload,
} from "../Controllers/course.js";

router.post(
  "/course/upload-image",
  requireSignin,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  imageCourse
);
router.post("/course/remove-image", removeImage);
router.post(
  "/course/create-course",
  requireSignin,
  isInstructor,
  createCourses
);
router.get("/course/:slug", readCourse);
router.post(
  "/course/video-upload/:id",
  requireSignin,
  formidable(),
  videoUpload
);
router.post("/course/video-remove/:id", requireSignin, removeVideo);
router.post("/course/lesson/:slug/:id", requireSignin, addLesson);
router.post("/course/:slug", requireSignin, deleteLesson);

export default router;
