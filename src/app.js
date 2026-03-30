import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"



// Express ko call kiya aur ek app object ban gaya
// Ab is app pe saari settings lagaenge
// Yeh app hi tumhara poora server hai
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,  //origin se pata chlega ki kisko access dena hai 
    credentials: true  // credentials se pata chlega ki cookies ko access dena hai ya nhi
}))

app.use(express.json({ limit: "16kb" })) // json data ko handle krne ke liye
app.use(express.urlencoded({ extended: true, limit: "16kb" })) // url encoded data ko handle krne ke liye
app.use(express.static("public")) // static files ko handle krne ke liye
app.use(cookieParser()) // cookies ko handle krne ke liye

//routes import


//routes declaration
app.use("/api/v1/users", userRouter)


// http://localhost:8000/api/v1/users/register

export { app }

// ### Poora flow ek baar
// ```
// App start hoti hai
//        ↓
// Middleware run hote hain (cors, json, urlencoded, static, cookieParser)
//        ↓
// ✅ Sab sahi → Requests accept karo
// ❌ Koi error → Error handle karo

// Middleware ka kaam:
// - CORS: Kon access karega?
// - JSON: Request body parse karo
// - URLencoded: URL data parse karo
// - Static: Public files serve karo
// - CookieParser: Cookies read karo