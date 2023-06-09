import ErrorHandler from "../utils/ErrorHandler.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { Job } from "../models/jobModel.js";
import mongoose from "mongoose";
import moment from "moment";

// @desc: create new job
// @router: [POST] api/v1/job/createJob
// @access: private
const createJob = asyncHandler(async (req, res, next) => {
  const { company, position } = req.body;

  if (!company || !position)
    return next(new ErrorHandler("plz fill all field"));

  req.body.createdBy = req.user.id;

  const job = await Job.create(req.body);

  res.status(201).json({
    success: true,
    message: "your are create Job",
    job,
  });
});

// @desc: get all jobs
// @router: [POST] api/v1/job/getallJob
// @access: private
const getAllJobs = asyncHandler(async (req, res, next) => {
  const {status, workType, search, sort} = req.query;

  // 1. condition for search query
  const queryObject = {
    createdBy: req.user.id
  }

  // 2. logic for searching filter
    // based on status 
  if(status && status !=="all"){
    queryObject.status = status
  }

    // based on workType
  if(workType && workType !=="all"){
    queryObject.workType = workType
  }

    // based on position 
  if(search){
    queryObject.position = {$regex: search, $options: "i"}
  }

  let queryResult = Job.find(queryObject)

  // sort 
    // i. sorted based on latest
  if(sort === "latest"){
    queryResult = queryResult.sort('-createdAt')
  }

    // ii. sorted based on oldest
  if (sort === "oldest"){
    queryResult = queryResult.sort('createdAt')
  }
  
    // iii. sorted based on asc position
  if(sort === "a-z"){
    queryResult = queryResult.sort('position')
  }
  
    // iv. sorted based on desc position
  if(sort === 'z-a'){
    queryResult = queryResult.sort('-position')
  }

  // adding pagination
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1)*limit

  queryResult = queryResult.skip(skip).limit(limit);

  // total jobs
  const totaljobs = await Job.countDocuments(queryResult)

  // number of pages
  const numberOfPage = Math.ceil(totaljobs/limit)
  const jobs = await queryResult;

  // const jobs = await Job.find({ createdBy: req.user.id });

  res.status(200).json({
    success: true,
    numberOfPage,
    totaljobs,
    jobs,
  });
});

// @desc: update the job
// @router: [PATCH] api/v1/job/updatejob/idkfaodijfoiajd(:id)
// @access: private
const updateJob = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;

  // validation
  if (!company || !position)
    return next(new ErrorHandler("plz add all field", 404));

  const job = await Job.findById({ _id: id });

  if (!job) return next(new ErrorHandler("user not found", 404));

  // not some else update the job description

  // IS MEIN KOI PROBLEM HO RAHA HAI US KO FIXED KARNA HAI
  if (req.user.id !== job.createBy.toString())
    return next(new ErrorHandler("not authorized to updated", 401));

  const updateJob = await Job.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "your are upate the job",
    updateJob,
  });
});

// @desc: delete the job
// @router: [DELETE] api/v1/job/delete/idkfaodijfoiajd(:id)
// @access: private
const deleteJob = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById({ _id: id });

  // validation
  if (!job) return next(new ErrorHandler("User not found", 404));

  // is mein tora sa kam karna hai
  if (job.createBy.toString() !== req.user.id)
    return next(
      new ErrorHandler("your are not authorized to delete the jobs", 401)
    );

  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: "your job is deleted by successfully",
  });
});

// @desc: filter the job
// @router: [get] api/v1/job/staticjob
// @access: private
const staticFilterInJob = asyncHandler(async (req, res, next) => {
  const stats = await Job.aggregate([
    // Stage 1: search the user
    {
      $match: { createdBy: new mongoose.Types.ObjectId(req.user.id) },
    },
    {
      $group: { _id: "$status", count: { $sum: 1 } },
    },
  ]);

  let monthlyApplication = await Job.aggregate([
    {
      $match: { createdBy: new mongoose.Types.ObjectId(req.user.id) },
    },
    {
      $group: {
        _id: {
          year:{ $year :"$createdAt" },
          month: {$month :"$createdAt"},
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
        
      return { date, count };
    })
    .reverse();

  // default status
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    reject: stats.reject || 0,
  };

  res.status(200).json({
    success: true,
    message: "your filter the job successfully",
    totalJob: stats.length,
    defaultStats,
    monthlyApplication,
  });
});

export { createJob, getAllJobs, updateJob, deleteJob, staticFilterInJob };
