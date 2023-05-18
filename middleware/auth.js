import { asyncHandler } from "./asyncHandler.js";
import {ErrorHandler} from "../utils/ErrorHandler.js"
import jwt from "jsonwebtoken"

export const isAuthencation = asyncHandler(async(req,res,next)=>{
    const {authorization} = req.headers;

    if(!authorization || !authorization.startsWith("Bearer")) 
        return next(new ErrorHandler("Not Authorized, not token",404))

    const {token} = authorization.split(' ')[1]

    const decode = jwt.verify(token, process.env.JWT_SECERT)

    req.user = {userId: payload._id}

    next()
})