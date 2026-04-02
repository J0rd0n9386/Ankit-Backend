import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens = async(userid) => {
    try {
       const user =  await User.findById(userid)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

       user.refreshToken = refreshToken
       await user.save({validateBeforeSave : false})

     return{accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}


try {
    const registerUser = asyncHandler(async (req, res) => {
        // get user details from frontend
        // validation - not empty
        // check if user already exists: username, email
        // check for images, check for avatar
        // upload them to cloudinary, avatar
        // create user object - create entry in db
        // remove password and refresh token field from response
        // check for user creation
        // return res
    
        const { username, email, password, fullName } = req.body
    
        if ([fullName, username, email, password].some((field) => !field || field?.trim() === "")) {
            throw new ApiError(400, "All fields are required")
        }
    
        const existingUser = await User.findOne({ $or: [{ username }, { email }] })
        if (existingUser) {
            throw new ApiError(409, "User with username or email already exists")
        }
    
        console.log(req.files);  // ⬅️ YEH ADD KARO
    
        const avatarLocalPath = req.files?.avatar?.[0]?.path
    
        //it is used to check if the cover image is uploaded or not
        let coverImageLocalPath = ""
        if (req.files?.coverImage && req.files.coverImage.length > 0) {
            coverImageLocalPath = req.files.coverImage[0].path
        }
    
        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar is required")
        }
    
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        console.log(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)
        console.log(coverImageLocalPath)
    
        if (!avatar) {
            throw new ApiError(400, "Avatar upload failed")
        }
    
        const user = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        })
    
        const createdUser = await User.findById(user._id).select("-password -refreshToken")
    
        if (!createdUser) {
            throw new ApiError(500, "User creation failed")
        }
    
    
    
        return res.status(201).json({
            message: "User created successfully",
            user: createdUser
        })
    })
    
    const loginUser = asyncHandler(async (req, res) => {
        // req body se data le aao
        // username or email
        //  find user
        // check if user exists
        // check if password is correct
        // generate access token and refresh token
        // send cookies
        // return res
    
        const { email, username, password } = req.body
    
        if (!username && !email) {
            throw new ApiError(400, "username or email is required")
        }
    
        const user = await User.findOne({
            $or: [{ username }, { email }]  //ya to username  mil jaaye ya email mil jaaye
        })
    
        if(!user) {
            throw new ApiError(404, "user does not exist")
        }
    
        const isPasswordvalid = await user.isPasswordCorrect(password)
    
         if(!isPasswordvalid) {
            throw new ApiError(401, "invalid user credentials")
        }
    
        //access token and access refresh token ko baar use krna hota hai 
        // isliye isko seprate function me likhte hai and yha import krte hai
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken") 
        // jo field hme nhi chahiye usko select me - lagake likh dete hai
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
        )
    
        
    
        
    
    })
    
    const logoutUser = asyncHandler(async (req, res) => {
        User.findByIdAndUpdate(req.user._id, {
            $set: {
                refreshToken: ""
            }
        }, {
            new: true
        })
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {},
            "User logged out successfully"
        )
        )
    })
    
    const refreshAccessToken = asyncHandler(async (req, res) => {
      const incomingRefreshToken =  req.cookies.refreshAccessToken || req.body.refreshToken
    
      if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
      }
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      )
      const user = await User.findById(decodedToken._id)
    
      if(!user) {
        throw new ApiError(401, "invalid user credentials")
      }
    
      if(user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "invalid user credentials")
      }
    
      const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
      const options = {
        httpOnly: true,
        secure: true
      }
    
      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, {
          user: user,
          accessToken,
          refreshToken
        },
        "User refreshed access token successfully"
      )
      )
       
    })
} catch (error) {
  throw new ApiError(500, error?.message || "Something went wrong while refreshing access token");
  
}

export { registerUser, loginUser, logoutUser, refreshAccessToken}

//  import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { User } from "../models/user.model.js";
// import { uploadOnCloudinary } from "../utils/cloudnary.js";

// const registerUser = asyncHandler(async (req, res) => {

//     // ─────────────────────────────────────────
//     // STEP 1: Request se data lo
//     // ─────────────────────────────────────────
//     const { username, email, password, fullName } = req.body


//     // ─────────────────────────────────────────///////////////////////////////////////////////////////////
//     // STEP 2: Validation — fields empty toh nahi?
//     // ─────────────────────────────────────────
//     if ([fullName, username, email, password].some((field) => !field || field?.trim() === "")) {
//         throw new ApiError(400, "All fields are required")
//     }


//     // ─────────────────────────────────────────
//     // STEP 3: User already exist karta hai kya?
//     // ─────────────────────────────────────────
//     const existingUser = await User.findOne({ $or: [{ username }, { email }] })
//     if (existingUser) {
//         throw new ApiError(409, "User with username or email already exists")
//     }


//     // ─────────────────────────────────────────
//     // STEP 4: Files ka local path lo (multer se)
//     // ─────────────────────────────────────────
//     const avatarLocalPath = req.files?.avatar?.[0]?.path
//     const coverImageLocalPath = req.files?.coverImage?.[0]?.path

//     if (!avatarLocalPath) {
//         throw new ApiError(400, "Avatar is required")
//     }


//     // ─────────────────────────────────────────
//     // STEP 5: Cloudinary pe upload karo
//     // ─────────────────────────────────────────
//     const avatar = await uploadOnCloudinary(avatarLocalPath)
//     const coverImage = await uploadOnCloudinary(coverImageLocalPath)

//     if (!avatar) {
//         throw new ApiError(400, "Avatar upload failed")
//     }


//     // ─────────────────────────────────────────
//     // STEP 6: Database mein user banao
//     // ─────────────────────────────────────────
//     const user = await User.create({
//         fullName,
//         avatar: avatar.url,
//         coverImage: coverImage?.url || "",
//         email,
//         password,
//         username: username.toLowerCase()
//     })


//     // ─────────────────────────────────────────
//     // STEP 7: Password aur refreshToken hatao response se
//     // ─────────────────────────────────────────
//     const createdUser = await User.findById(user._id).select("-password -refreshToken")

//     if (!createdUser) {
//         throw new ApiError(500, "User creation failed")
//     }


//     // ─────────────────────────────────────────
//     // STEP 8: Response bhejo
//     // ─────────────────────────────────────────
//     return res.status(201).json({
//         message: "User created successfully",
//         user: createdUser
//     })
// })


// const loginUser = asyncHandler(async (req, res) => {
//     res.status(200).json({
//         message: "User logged in successfully"
//     })
// })

// // export { registerUser, loginUser }