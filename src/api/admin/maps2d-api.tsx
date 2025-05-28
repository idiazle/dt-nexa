import { MenuIconsStructure } from "@/lib/utils"
import axiosInstance from "../axios/axios-instance"

export const getMapPlans2dIcons = async () => {
    return await axiosInstance.get<{
        data: MenuIconsStructure[]
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plans-2d-icons`)
}

export const deleteMapPlans2dIcon = async (id:number) => {
    return await axiosInstance.delete<{
        data: MenuIconsStructure[]
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plan-2d-icon/${id}`)
}

export const putMapPlans2dIcon = async (id:number, data:any) => {
    return await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plan-2d-icon/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}


export const postMapsPlans2dIcons = async (data: any) => {
    return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plans-2d-icons`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}