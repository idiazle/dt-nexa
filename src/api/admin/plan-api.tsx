import { PlanStructure } from "@/lib/utils"
import axiosInstance from "../axios/axios-instance"


export const getPlans = async (page: number) => {
    return await axiosInstance.get<{
        count: number
        data: PlanStructure[]
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/plans?page=${page}`)
}
export const getPlanById = async (id: number) => {
    return await axiosInstance.get<{
        data: PlanStructure
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/plan/${id}`)
}

export const deletePlanById = async (id: number) => {
    return await axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/plan/${id}`)
}
