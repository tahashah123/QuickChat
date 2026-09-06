import {create} from "axios"

export const axiosInstance = create({
    baseURL:import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    withCredentials:true
})

