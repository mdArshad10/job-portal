import express from "express"
import { postTest } from "../controller/testController.js";

const router = express.Router();

router
    .route('/')
    .post(postTest)

export default router;