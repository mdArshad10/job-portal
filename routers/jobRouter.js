import express from "express"
import { createJob, getAllJobs, updateJob, deleteJob } from "../controller/jobController.js";
import { isAuthencation } from "../middleware/auth.js";

const router = express.Router()

router.post('/createJob', isAuthencation, createJob);

router.get('/getallJob',isAuthencation, getAllJobs)

router.patch('/updatejob/:id', isAuthencation, updateJob)

// TODO: Not testing in thunder Client
router.delete('/delete/:id', isAuthencation, deleteJob )

export default router;