import {create} from "axios"

export const axiosInstance = create({
    baseURL:"http://localhost:3000/api",
    withCredentials:true
})

