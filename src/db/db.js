import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(`MongoDB connected !! HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;

// ### Poora flow ek baar
// ```
// App start hoti hai
//        ↓
// connectDB() call hoti hai
//        ↓
// MongoDB URI + DB_NAME se connect karo
//        ↓
// ✅ Hua → Host print karo → App chalta rahe
// ❌ Nahi hua → Error print karo → App band karo