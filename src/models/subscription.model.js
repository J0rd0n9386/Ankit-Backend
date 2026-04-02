import mongoose, {schema} from "mongoose"

const subscription =  new schema(
    {
        subscriber:{
            type: schema.Types.Objectid, //one who is subscribing
            ref:"User"

        },
        channel: {
            type: schema.Types.Objectid, // one to whom subscriber is subscribing
            ref: "User"
        }
    },{timestamps: true}
)




export const Subscription = mongoose.model("Subscription",subscriptionSchema)