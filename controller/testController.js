import { asyncHandler } from "../middleware/asyncHandler.js";

// @router [POST] /api/v1/test
const postTest = asyncHandler(async(req,res,next)=>{
    const {name} = req.body;

    res.status(200).json({
        success: true,
        message: `the test is successed by ${name}`
    })
})

export { postTest}