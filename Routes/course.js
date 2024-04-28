import express from "express";
import formidable from "express-formidable";

const router = express.Router();

import { isInstructor, requireSignin } from "../Middleware/verify.js";
import {
  addLesson,
  checkEnrollment,
  checkout,
  courses,
  createCourses,
  deleteLesson,
  freeEnrollment,
  imageCourse,
  paymentVerification,
  publish,
  readCourse,
  removeImage,
  removeVideo,
  unpublish,
  videoUpload,
} from "../Controllers/course.js";

//Subscriber Courses
router.get("/courses", courses);
router.get("/courseView/:slug", readCourse);

//Instructor Courses
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
router.put("/course/publish/:courseId", publish);
router.put("/course/unpublish/:courseId", unpublish);
router.get("/check-enrollment/:courseId", requireSignin, checkEnrollment);
router.post("/free-enrollment/:courseId", requireSignin, freeEnrollment);
router.post("/order", checkout);
router.post("/paymentverification", paymentVerification);

export default router;
