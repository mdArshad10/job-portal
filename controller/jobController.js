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

// @desc: get all jobs
// @router: [POST] api/v1/job/getallJob
// @access: private
const getAllJobs = asyncHandler(async(req,res,next)=>{
    const jobs = await Job.find({createBy: req.user.id})

    res.status(200).json({
        success: true,
        totalJob: jobs.length,
        jobs
    })
})

// @desc: update the job
// @router: [PATCH] api/v1/job/updatejob/idkfaodijfoiajd(:id)
// @access: private
const updateJob = asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const {company, position} = req.body;

    // validation
    if(!company || !position) return next(new ErrorHandler('plz add all field',404))
    
    const job = await Job.findById({_id: id})

    if(!job) return next(new ErrorHandler("user not found",404))

    // not some else update the job description

    // TODO: IS MEIN KOI PROBLEM HO RAHA HAI US KO FIXED KARNA HAI
    if(!req.user.id === job.createBy.toString()) return next(new ErrorHandler("not authorized to updated",401))

    const updateJob = await Job.findByIdAndUpdate({_id:id}, req.body,{
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        message: "your are upate the job",
        updateJob
    })
})

// @desc: delete the job
// @router: [DELETE] api/v1/job/delete/idkfaodijfoiajd(:id)
// @access: private
const deleteJob = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;
    const job = await Job.findById({_id:id})

    // validation
    if(!job) return next(new ErrorHandler("User not found",404))

    // TODO: is mein tora sa kam karna hai
    if(!job.createBy.toString() === req.user.id) return next(new ErrorHandler("your are not authorized to delete the jobs",401))

    await job.deleteOne()

    res.status(200).json({
        success:true,
        message: 'your job is deleted by successfully'
    })
})

export {createJob, getAllJobs, updateJob, deleteJob};
