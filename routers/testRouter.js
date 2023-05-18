import express from "express"
import { postTest } from "../controller/testController.js";
import {isAuthencation} from "../middleware/auth.js"

const router = express.Router();

router
    .route('/')
    .post(isAuthencation, postTest )

export default router;