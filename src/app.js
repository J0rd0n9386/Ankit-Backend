import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,  //origin se pata chlega ki kisko access dena hai 
    credentials: true  // credentials se pata chlega ki cookies ko access dena hai ya nhi
}))

app.use(express.json({limit: "16kb"})) // json data ko handle krne ke liye
app.use(express.urlencoded({extended: true, limit: "16kb"})) // url encoded data ko handle krne ke liye
app.use(express.static("public")) // static files ko handle krne ke liye
app.use(cookieParser()) // cookies ko handle krne ke liye



export {app}