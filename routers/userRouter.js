import express from "express"
import { loginUser, userRegister, updateUser } from "../controller/userController.js";
import {isAuthencation} from "../middleware/auth.js"

const router = express.Router()

// register
router.post('/register', userRegister)

// login
router.post('/login', loginUser)

// update
router.put('/update', isAuthencation, updateUser)



export default router;