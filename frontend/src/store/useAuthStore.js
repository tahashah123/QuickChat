import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { io } from "socket.io-client"

const BASE_URL = "http://localhost:3000"
export const useAuthStore = create((set,get)=>({
    authUser:null,
    isCheckingAuth:true,
    isLoggingIn:false,
    isSignningUp:false,
    isUpdatingProfile:false,
    onlineUsers:[],
    socket:null,

    authCheck:async()=>{
        try {
            const res = await axiosInstance.get("/auth/checkAuth")
            set({authUser:res.data})
            get().connectSocket()

        } catch (error) {
            console.log("error in check Auth function :"+error)
            set({ authUser: null });
        }finally{
            set({isCheckingAuth:false})
        }
    } ,

    signup :async (data)=>{
        try {
            set({isSignningUp:true})
            const res = await axiosInstance.post("/auth/signup",data)
            set({authUser:res.data})
            toast.success("Account created successfuly")
            get().connectSocket()
        } catch (error) {
              toast.error(error.response?.data?.message || "Unable to create account. Check that the server is running.")
        }finally{
            set({isSignningUp:false})
        }
    },

    login: async (data)=>{
        try {
            set({isLoggingIn:true})
            const res = await axiosInstance.post("/auth/login",data)
             set({authUser:res.data})
            toast.success("Logged in successfully")
            get().connectSocket()
        } catch (error) {
              toast.error(error.response?.data?.message || "Unable to login. Check that the server is running.")
        }finally{
            set({isLoggingIn:false})
        }
    },

    logout: async()=>{
        try {
            await axiosInstance.post("/auth/logout")
            set({authUser:null})
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to logout")
        } finally {
            get().disconnectSocket()
            set({authUser:null})
        }
    },
    updateProfile : async(image)=>{
        try {
            set({isUpdatingProfile:true})
           const res = await axiosInstance.put("/auth/updateprofile",image)
           set({authUser:res.data})
           toast.success("Profile updated successfuly")
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to update profile")
        } finally{
            set({isUpdatingProfile:false})
        }
    },
    connectSocket : ()=>{
        const {authUser} = get()
        if(!authUser||get().socket?.connected) return;
        const socket = io(BASE_URL,{
            query:{
                userId:authUser._id,
            }
        })
        socket.connect()
        set({socket:socket})

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds})
        })
    },
    disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
        socket.disconnect();
    }
    set({ socket: null, onlineUsers: [] });
}
}))