import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_ClOUD);
        console.log(`the monogDB is connected at ${mongoose.connection.host}`);
    } catch (error) {
        console.log(`the mongoose error is ${error}`);       
    }
}

export default connectDB