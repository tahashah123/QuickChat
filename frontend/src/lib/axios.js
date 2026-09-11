import {create} from "axios"

export const axiosInstance = create({
    baseURL:import.meta.env.MODE==="development" ? "http://localhost:3000/api":"/api",
    withCredentials:true
})

