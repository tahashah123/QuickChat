import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get)=>({
    users:[],
    messages:[],
    selectedUser:null,
    unreadCounts:{},
    isMessagesLoading:false,
    isUsersLoading:false,

    getUsers:async()=>{
       set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
    },
    getMessages:async(userId)=>{
        try {
            set({isMessagesLoading:true})
            const res =await axiosInstance.get(`/messages/${userId}`)
            set({messages:res.data})
        } catch (error) {
             toast.error(error.response?.data?.message || "Unable to get Messages")
        }finally{
            set({isMessagesLoading:false})
        }
    },
    sendMessage:async(messageData)=>{
        try {
            const {messages,selectedUser} = get()
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
            set({messages:[...messages,res.data]})
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to send Messages")
        }
    },
    setSelectedUser:async(selectedUser)=>{
        set((state)=>({
            selectedUser,
            unreadCounts: selectedUser ? {...state.unreadCounts,[selectedUser._id]:0} : state.unreadCounts,
        }))
    },
    subscribeToMessages:()=>{
       const {socket} = useAuthStore.getState()
       if(!socket) return;
       socket.on("newMessage",(newMessage)=>{
        const currentSelectedUser = get().selectedUser
        socket.emit("messageDelivered", newMessage._id)
        if (String(newMessage.senderId) === String(currentSelectedUser?._id)) {
          socket.emit("messageRead", newMessage._id)
          set({messages:[...get().messages,newMessage]})
          return
        }
        set((state)=>({
          unreadCounts:{
            ...state.unreadCounts,
            [newMessage.senderId]: Math.min((state.unreadCounts[newMessage.senderId] || 0) + 1, 99),
          },
        }))
       })
       socket.on("messageReceipt", ({ messageId, status }) => {
        set((state) => ({
          messages: state.messages.map((message) => message._id === messageId
            ? { ...message, deliveredAt: status === "delivered" ? new Date().toISOString() : message.deliveredAt || new Date().toISOString(), readAt: status === "read" ? new Date().toISOString() : message.readAt }
            : message),
        }));
       })
    },
    unsubscribeFromMessages:()=>{
        const {socket} = useAuthStore.getState()
        if(!socket) return;
        socket.off("newMessage")
        socket.off("messageReceipt")
    }
}))
