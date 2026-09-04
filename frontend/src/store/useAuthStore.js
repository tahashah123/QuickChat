import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useAuthStore = create((set)=>({
    authUser:null,
    isCheckingAuth:true,
    isLoggingIn:false,
    isSignningUp:false,
    isUpdatingProfile:false,

    authCheck:async()=>{
        try {
            const res = await axiosInstance.get("/auth/checkAuth")
            set({authUser:res.data})

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
        } catch (error) {
           toast.error(error.response?.data?.message || "Unable to create account")
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
        } catch (error) {
           toast.error(error.response?.data?.message || "Unable to login")
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
        }
    }
}))