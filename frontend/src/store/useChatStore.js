import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get)=>({
    users:[],
    messages:[],
    selectedUser:null,
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
        set({selectedUser})
    },
    subscribeToMessages:()=>{
       const {selectedUser} = get()
       if(!selectedUser) return;
       const {socket} = useAuthStore.getState()
       if(!socket) return;
       socket.on("newMessage",(newMessage)=>{
        const currentSelectedUser = get().selectedUser
        if (String(newMessage.senderId) !== String(currentSelectedUser?._id)) return
        set({messages:[...get().messages,newMessage]})
       })
    },
    unsubscribeFromMessages:()=>{
        const {socket} = useAuthStore.getState()
        if(!socket) return;
        socket.off("newMessage")
    }
}))