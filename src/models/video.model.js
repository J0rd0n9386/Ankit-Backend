import mongoose, { Schema } from "mongoose";


const videoSchema = new Schema(
    {
      videoFile:{
        type:string,   //cloudnary url
        required: true
      },
      thumbnail:{
        type:string,   //cloudnary url
        required: true,
      },
      title:{
        type:string,   
        required: true,
      },
      description:{
        type:string,   
        required: true,
      },
      duration:{
        type:Number,   
        required: true,
      },
      views:{
        type:Number,   
        required: true,
      },
      isPublished:{
        type:Boolean,   
        required: true,
      },
      owner:{
        type:Schema.Types.ObjectId,   
        ref:"User"
      }
    },{timestamps:true}
)



export const Video = mongoose.model("Video", videoSchema)
