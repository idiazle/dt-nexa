import { PhotogrametryStructure } from "@/lib/utils"
import axiosInstance from "../axios/axios-instance"

export const getNodes360 = async () => {
  return await axiosInstance.get<{
    data: PhotogrametryStructure[]
  }>(`${process.env.NEXT_PUBLIC_BACK_URL}/nodes360`)
}

export const getNodes360ById = async (id: number) => {
  return await axiosInstance.get<{
    data: PhotogrametryStructure
  }>(`${process.env.NEXT_PUBLIC_BACK_URL}/node360/${id}`)
}

export const deleteNode360ById = async (id: number) => {
  return await axiosInstance.delete<{
    data: PhotogrametryStructure
  }>(`${process.env.NEXT_PUBLIC_BACK_URL}/node360/${id}`)
}

export const putNode360 = async (id: number, data: any) => {
  return await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/node360/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}


export const postNodes360 = async (data: any) => {
  return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/nodes360`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const patchPhotogNodeById = async (id: number, data: any) => {
  return await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/node360/${id}`, data)
}