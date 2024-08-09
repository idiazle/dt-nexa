import axios from "axios"
import axiosInstance from "../axios/axios-instance"
export const getEntities = async () => {
    return await axiosInstance.get<{
        data: any[]
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/entity`)
}