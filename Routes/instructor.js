import express from "express";

const router = express.Router();

import { requireSignin } from "../Middleware/verify.js";
import { makeInstructor } from "../Controllers/instructor.js";

router.post("/make-instructor", requireSignin, makeInstructor);
export default router;
