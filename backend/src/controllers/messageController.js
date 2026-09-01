import user from "../models/user.js"
import Message from "../models/message.js"
import cloudinary from "../lib/cloudinary.js"
export const getUsersForSidebar = async (req,res)=>{
   try {
     const loggedInUserId = req.user._id
     const users = await user.find({_id:{$ne:loggedInUserId}}).select("-password")
     if(!users) return res.sendStatus(404)
    return  res.status(200).json(users)
   } catch (error) {
        console.error("Error in get users controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
   }

}

export const getMessages =async (req,res)=>{
    try {
        const {id:userToChatId} = req.params
        const senderId = req.user._id
        const messages = await Message.find({$or:[{receiverId:userToChatId,senderId:senderId},
            {receiverId:senderId,senderId:userToChatId}]})
        return res.status(200).send(messages)
    } catch (error) {
        console.error("Error in get messages controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const sendMessage = async (req,res)=>{
    try {
        const {id:receiverId} = req.params
        const senderId = req.user._id
        const {text,image} = req.body
        let imageURL;
        if(image) {
          const uploadResponse =  await cloudinary.uploader.upload(image)
          imageURL = uploadResponse.secure_url
        }

        const newMessage = new Message({
            receiverId,
            senderId,
            text,
            image:imageURL
        })
        //todo => realtime functionality with socket.io
        res.status(200).json()
        await message.save(newMessage)
    } catch (error) {
        console.error("Error in send message controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}