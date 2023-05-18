import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


const schema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is required']
    },
    password:{
        type: String,
        uniqued:true,
        required: [true, 'email is required'],
        select: false
    },
    email:{
        type: String,
        required: [true, 'email is required'],
        validate: validator.isEmail,
    },
    location:{
        type: String,
        default: "India"
    }
},{timestamps:true})


// hashed password
schema.pre("save", async function(){

    if(!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// generate token
schema.methods.createJWT = function(){
    return jwt.sign({_id:this._id},process.env.JWT_SECERT,{
        expiresIn:'15d'
    })
}

// compare the password
schema.methods.comparePassword = async function(plainPassword){
    return await bcrypt.compare(plainPassword,this.password)
}


export const User = mongoose.model("User",schema)