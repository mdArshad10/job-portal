import express from "express"
import { createJob } from "../controller/jobController.js";
import { isAuthencation } from "../middleware/auth.js";

const router = express.Router()

router.post('/createJob', isAuthencation, createJob);

export default router;