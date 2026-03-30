import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "ok"
    })
})

const loginUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "User logged in successfully"
    })
})

export { registerUser, loginUser }
