import { MenuIconsStructure } from "@/lib/utils"
import axiosInstance from "../axios/axios-instance"

export const getMapPlans2dIcons = async () => {
    return await axiosInstance.get<{
        data: MenuIconsStructure[]
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plans-2d-icons`)
}