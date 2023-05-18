import { asyncHandler } from "../middleware/asyncHandler.js"
import ErrorHandler from "../utils/ErrorHandler.js"
import {User} from "../models/userModel.js"

// @desc user register
// @router [POST] api/v1/auth/register
// @access public
export const userRegister = asyncHandler(async(req,res,next)=>{
    const {name,email,password,location} = req.body

    if (!name || !email || !password || !location) {
        return next(new ErrorHandler('plz fill all felid',404))
    }

    const userExist = await User.findOne({email})

    if(userExist) return next(new ErrorHandler("you are already present",404))

    const newUser = await User.create({
      name, 
      email, 
      location,
      password
    })
    
    res.status(200).json({
        success: true,
        newUser:{
            name: newUser.name,
            email: newUser.email,
            location: newUser.location
        },
        token: newUser.createJWT()
    })
})

// @desc user's login
// @router [POST] api/v1/auth/login
// @access public
export const loginUser = asyncHandler(async(req,res,next)=>{
    const {email,password} = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('plz fill all felid',404))
    }

    const user = await User.findOne({email}).select("+password")
    console.log(user);

    if (!user) {
        return next(new ErrorHandler("User is not found",404))
    }

    const isMatch = await user.comparePassword(password)
    
    if(!isMatch) return next(new ErrorHandler("invalid credintal",404))

    res.status(200).json({
        success:true,
        message:"your are login",
        user:{
            name: user.name,
            email: user.email,
            location: user.location
        },
        token: user.createJWT()
    })
})


// @desc user's update
// @router [PUT] api/v1/auth/update
// @access private
export const updateUser = asyncHandler(async (req,res,next)=>{
    const {name, email, location} = req.body;
    
    if(!name || !email || !location) return next(new ErrorHandler("plz add all field",400))

    const user = await User.findById({_id: req.user.id})

    if(!user) return next(new ErrorHandler('Not authorized',401))

    user.name = name
    user.email = email
    user.location = location

    user.save()

    res.status(200).json({
        success: true,
        message:'u r updated',
        user,
        token: user.createJWT()
    })
    
})