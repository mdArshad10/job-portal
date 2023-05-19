import mongoose from "mongoose";

const schema = new mongoose.Schema({
    company:{
        type:String,
        required:[true, "plz add the company name"]
    },
    position:{
        type: String,
        required:[true, "plz add the position"],
        maxlength: 100,
    },
    status:{
        type: String,
        enum:['pending',"interview","reject"],
        default: "pending"
    },
    workType:{
        type: String,
        enum:["full-time", "part-time", "internship", "contaract"],
        default: "full-time"
    },
    workLocation:{
        type: String,
        default:'Kolkata',
        required:[true, "work location required"]
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref:"User"
    },
},{timestamps:true})

export const Job = mongoose.model('Job',schema);