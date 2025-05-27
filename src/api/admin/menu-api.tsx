import axiosInstance from "../axios/axios-instance"

export const getMenuIcons = async () => {
    return await axiosInstance.get<{
        data: any[]
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/menu-icons`)
}