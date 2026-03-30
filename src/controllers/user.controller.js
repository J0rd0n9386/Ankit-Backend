import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";

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

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

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
    res.status(200).json({
        message: "User logged in successfully"
    })
})

export { registerUser, loginUser }

//  import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { User } from "../models/user.model.js";
// import { uploadOnCloudinary } from "../utils/cloudnary.js";

// const registerUser = asyncHandler(async (req, res) => {

//     // ─────────────────────────────────────────
//     // STEP 1: Request se data lo
//     // ─────────────────────────────────────────
//     const { username, email, password, fullName } = req.body


//     // ─────────────────────────────────────────
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