import express from "express"
import cors from "cors";
import cookieParser from 'cookie-parser';
import employeeRouter from "./router/employee.router.js"
import applicationRouter from "./router/application.router.js"
import adminRouter from "./router/admin.router.js"
import reviewsRouter from "./router/review.router.js"
import mongoose from "mongoose";

const app = express();


app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use("/api/test", employeeRouter)
app.use("/api/application", applicationRouter)
app.use("/api/admin", adminRouter)
app.use("/api/review", reviewsRouter)

app.listen(4444, () => {
    console.log("Server is running on port 4444")
})