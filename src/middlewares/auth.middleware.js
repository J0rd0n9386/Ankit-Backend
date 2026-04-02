import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        //token lega ya to cookie se ya header se
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }

        //verify token ko verify karega .env se secret key use karke
        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        //_id token se mili thi, 
        //usse hum Database me user ko dhoondhte hain.
        // Password aur refresh token ko hide kar dete hain.
        const user = await User.findById(decodedToken._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        //Humne jo user database se nikala, usko aage jaane wali request (req.user) ke andar daal diya.
        // Iska fayda yeh hai ki ab iske aage jo bhi function chalega (jaise profile update karna), 
        // usko baar-baar database me user dhoondhna nahi padega, use sidha req.user se data mil jayega.
        // Aakhir me next() call kiya, jiska matlab hai: "Authentication successful, 
        // ab user ko main route ka code execute karne do."
        req.user = user;
        next();


    } catch (error) {
        throw new ApiError(
            401,
            error?.message || "Invalid access token"
        );
    }
});

//Humne jo user database se nikala, usko aage jaane wali request (req.user) ke andar daal diya.
// Iska fayda yeh hai ki ab iske aage jo bhi function chalega (jaise profile update karna), 
// usko baar-baar database me user dhoondhna nahi padega, use sidha req.user se data mil jayega.
// Aakhir me next() call kiya, jiska matlab hai: "Authentication successful, 
// ab user ko main route ka code execute karne do."