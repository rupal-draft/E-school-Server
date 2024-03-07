import express from "express";

const router = express.Router();

import { register, login, logout, currentUser } from "./../Controllers/auth.js";
import { requireSignin } from "../Middleware/verify.js";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser);

export default router;
