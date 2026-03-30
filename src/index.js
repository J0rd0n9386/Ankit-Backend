//behtar approach
// make a file name db.js in db folder import here 

//require("dotenv").config({path: "./env"})
import dotenv from "dotenv";
import connectDB from './db/db.js';
import { DB_NAME } from './constants.js';
import express from "express";
const app = express();

dotenv.config({
    path: './.env'  // dot lagao .env se pehle
})
    
    console.log(process.env.MONGODB_URI); 
    connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000 , () =>{
            console.log(`Server is running at port : ${process.env.PORT}`);
            
        })
    })
    .catch((error) => {
        console.log("MONGO db connection failed !!" , error);
        
    })
     
// ### Poora flow ek baar
// ```
// App start hui
//      ↓
// .env file load karo (secrets ready karo)
//      ↓
// MongoDB se connect karo (connectDB)
//      ↓
// ✅ Connected → Server start karo (app.listen)
//                     ↓
//              Customers aa sakte hain!

// ❌ Failed → Error print karo
//                     ↓
//              Server mat kholo










// 1st Approach
// import express from "express"
// const app = express()

// function connectDB(){}
// //behtar apporach
// ;( async() =>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error) => {
//             console.log("ERRR:",error);
//             throw error
            
//         })

//         app.listen(process.env.PORT, () => {
//             console.log("App is listening on `${process.env.PORT}"`);
            
//         })
//     } catch (error) {
//         console.log("Error",error)
//     }
// })()

