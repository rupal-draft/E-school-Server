import express from "express";

const router = express.Router();

import {
  register,
  login,
  logout,
  currentUser,
  forgotPassword,
  resetPassword,
} from "./../Controllers/auth.js";
import { requireSignin } from "../Middleware/verify.js";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);

export default router;
