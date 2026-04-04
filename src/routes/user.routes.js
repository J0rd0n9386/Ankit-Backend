import { Router } from "express"
import { 
    registerUser,
    loginUser,               // ✅ add kiya — /login mein use ho raha tha
    logoutUser,              // ✅ add kiya — /logout mein use ho raha tha
    refreshAccessToken,      // ✅ add kiya — /refresh-token mein use ho raha tha
    changeUserPassword,      // ✅ add kiya — /change-password mein use ho raha tha
    getCurrentUser,          // ✅ add kiya — /current-user mein use ho raha tha
    updateAccountDetails,
    updateUserAvatar,        // ✅ typo fix kiya — updateuserAvatar → updateUserAvatar
    updateUserCoverImage,    // ✅ add kiya — /cover-image mein use ho raha tha
    getUserChannelProfile,
    getUserWatchHistory,     // ✅ add kiya — /watch-history mein use ho raha tha
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        { name: "avatar",     maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// secured Routes
router
.route("/logout")
.post(verifyJWT, logoutUser)
router.route("/refresh-token").post(verifyJWT, refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeUserPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)        
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/watch-history").get(verifyJWT, getUserWatchHistory)

export default router