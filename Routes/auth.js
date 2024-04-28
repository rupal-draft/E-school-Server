import express from "express";

const router = express.Router();

import {
  register,
  login,
  logout,
  currentUser,
  forgotPassword,
  resetPassword,
  userCourses,
} from "./../Controllers/auth.js";
import { requireSignin } from "../Middleware/verify.js";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);
router.get("/user/get-courses", requireSignin, userCourses);

export default router;
