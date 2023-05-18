import express from "express"
import { loginUser, userRegister } from "../controller/userController.js";

const router = express.Router()

// register
router.post('/register', userRegister)

// login
router.post('/login', loginUser)


export default router;