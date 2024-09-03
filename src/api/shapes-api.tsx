import { ShapeStructure } from "@/lib/utils"
import axiosInstance from "./axios/axios-instance"

export const postShapes = async (data: ShapeStructure) => {
  return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/navigation2d`, data
  )
}

export const getAllShapes = async () => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/navigation2d`)
}

export const getShapeById = async (id: number) => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/navigation2d/${id}`)
}

export const getMap2dIcons = async () => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/map2d-icons`)
}

export const putShapeById = async (id: number, data:any) => {
  return await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/navigation2d/${id}`,data)
}

export const deleteShapeById = async (id: number) => {
  return await axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/navigation2d/${id}`)
}