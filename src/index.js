//behtar approach
// make a file name db.js in db folder import here 

//require("dotenv").config({path: "./env"})
import dotenv from "dotenv"
import connectDB from './db/db.js';
import { DB_NAME } from './constants.js';

dotenv.config({
    path: './.env'  // dot lagao .env se pehle
})
    
    console.log(process.env.MONGODB_URI); 
    connectDB()
     











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

