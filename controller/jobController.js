import ErrorHandler from "../utils/ErrorHandler.js"
import {asyncHandler} from "../middleware/asyncHandler.js"
import { Job } from "../models/jobModel.js"

// @desc: create new job
// @router: [POST] api/v1/job/createJob
// @access: private
const createJob = asyncHandler(async(req,res,next)=>{
    const {company, position} = req.body;

    if (!company || !position) return next(new ErrorHandler("plz fill all field"))
    
    req.body.createBy = req.user.id;
    
    const job = await Job.create(req.body)

    res.status(201).json({
        success: true,
        message: "your are create Job",
        job
    })
})



export {createJob};
