import {Server} from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.js";

const app = express()
const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173"
},
})
const getReceiverSocketId = (userId)=>{
    return userSocketMap[userId]
}
const userSocketMap = {} //use to store online users {userId:socketId}

io.on("connection",(socket)=>{
    console.log("user connected succesfuly", socket.id)
    const userId = socket.handshake.query.userId
    if(userId) userSocketMap[userId] = socket.id

    io.emit("getOnlineUsers",Object.keys(userSocketMap))
    const updateReceipt = async (messageId, status) => {
        if (!userId) return;
        const message = await Message.findOne({ _id: messageId, receiverId: userId });
        if (!message) return;
        const now = new Date();
        if (status === "delivered" && message.deliveredAt) return;
        if (status === "read" && message.readAt) return;
        await Message.updateOne(
            { _id: message._id },
            { $set: status === "read" ? { deliveredAt: message.deliveredAt || now, readAt: now } : { deliveredAt: now } }
        );
        const senderSocketId = getReceiverSocketId(message.senderId.toString());
        if (senderSocketId) io.to(senderSocketId).emit("messageReceipt", { messageId: message._id.toString(), status });
    };
    socket.on("messageDelivered", (messageId) => updateReceipt(messageId, "delivered"));
    socket.on("messageRead", (messageId) => updateReceipt(messageId, "read"));
    socket.on("disconnect",()=>{
        console.log("user disconnected", socket.id)
        if (userId && userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId]
        }
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})

export {io,server,app,getReceiverSocketId};
