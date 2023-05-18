// import 
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import color from "color"
import morgan from "morgan"

// import file
import connectDB from "./config/db.js"
import { errorHandlerMidleware } from "./middleware/error.js"

// import Router
import userRouter from "./routers/userRouter.js"
import testRouter from "./routers/testRouter.js"
import jobRouter from "./routers/jobRouter.js"

// dot env Config
dotenv.config({
    path:"./config/config.env"
})

// connect the mongodb
connectDB();

// rest object
const app = express()

// middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan("dev"))


// router
app.use('/api/v1/auth',userRouter)
app.use('/api/v1/test', testRouter)
app.use('/api/v1/job', jobRouter)

// app.use('/', (req,res)=>{
//     res.send(`<h1>this is the backend of JOB Portal by Arshad</h1>`)
// })


// listen
app.listen(process.env.PORT, (req,res)=>{
    console.log(`the server is running in ${process.env.DEV_MODE} at ${process.env.PORT}`);
})

app.use(errorHandlerMidleware)