import axios from "axios"
import axiosInstance from "../axios/axios-instance"
import { EntityStructure } from "@/lib/utils"
export const getEntities = async () => {
    return await axiosInstance.get<{
        data: any[]
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/entity`)
}

export const postEntity = async (data: FormData) => {
    return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/entity`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const getEntityById = async (id: number) => {
    return await axiosInstance.get<{
        data: EntityStructure
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/entity/${id}`)
}

export const getEntityInfo = async (id: number) => {
    return await axiosInstance.get<{
        data: EntityStructure
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/getEntityInfo/${id}`)
}

export const putEntity = async (id: number, formValue: FormData) => {
    return await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/entity/${id}`, formValue, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const deleteEntity = async (id: number) => {
    return await axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/entity/${id}`)
}