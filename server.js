// swagger doc
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// import
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import color from "color";
import morgan from "morgan";
import helmet from "helmet";
import xss from "xss-clean";
import ExpressMongoSanitize from "express-mongo-sanitize";

// import file
import connectDB from "./config/db.js";
import { errorHandlerMidleware } from "./middleware/error.js";

// import Router
import userRouter from "./routers/userRouter.js";
import testRouter from "./routers/testRouter.js";
import jobRouter from "./routers/jobRouter.js";

// dot env Config
dotenv.config({
  path: "./config/config.env",
});

// connect the mongodb
connectDB();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      description: "Node Expressjs Job Portal Application",
    },
    servers: [
      {
        url: "http://localhost:8080",
          
      },
    ],
  },
  apis: ["./routers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

// rest object
const app = express();

// middleware
app.use(helmet());
app.use(xss());
app.use(ExpressMongoSanitize());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// router
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/test", testRouter);
app.use("/api/v1/job", jobRouter);

// 
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


// listen
app.listen(process.env.PORT, (req, res) => {
  console.log(
    `the server is running in ${process.env.DEV_MODE} at ${process.env.PORT}`
  );
});

app.use(errorHandlerMidleware);
