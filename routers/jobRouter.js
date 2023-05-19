import express from "express"
import { createJob, getAllJobs } from "../controller/jobController.js";
import { isAuthencation } from "../middleware/auth.js";

const router = express.Router()

router.post('/createJob', isAuthencation, createJob);

router.get('/getallJob',isAuthencation, getAllJobs)

export default router;