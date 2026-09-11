import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String
    },
    image:{
        type:String
    },
    deliveredAt:{
        type:Date,
        default:null
    },
    readAt:{
        type:Date,
        default:null
    }
},{timestamps:true} 
)

const Message = mongoose.model("Message",messageSchema)

export default Message
