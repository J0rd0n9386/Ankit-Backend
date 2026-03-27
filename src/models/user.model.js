import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        username: {
            type: string,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: string,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        email: {
            type: string,
            required: true,
            trim: true,
            index: true
        },
        fullname: {
            type: string,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: string,  //cloudnary url use krenge
            required: true,
        },
        coverImage: {
            type: string,  //cloudnary url use krenge

        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: string,
            required: [true, "Password is required"]
        },
        refreshToken: {
            type: string,
            required: true,
        },
    },
    { timestamps: true }
)
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();  // agr password change nhi hua to next() call kr do

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
userSchema.plugin(mongooseAggregatePaginate)






export const User = mongoose.model("User", userSchema)
//bcrypt use krna hai password ke liye to hash your password