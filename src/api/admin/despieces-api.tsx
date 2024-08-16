import { type AxiosRequestConfig } from 'axios'
import axiosInstance from '../axios/axios-instance'


export const getDespieces = async () => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/despieces`)
}
export const getDespieceById = async (id: number) => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/despiece/${id}`)
}
export const getDespieceByArea = async (id: number, entityType: any, interactType: any) => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/despiece-by-area/${id}?entity_type=${entityType}&interact_type=${interactType}`)
}


export const deleteDespiece = async (id: number) => {
  return await axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/despiece/${id}`)
}

export const postDespiece = async (data: FormData, config: AxiosRequestConfig) => {
  return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/despieces`, data, config)
}

export const putDespiece = async (data: FormData, id: number, config: AxiosRequestConfig) => {
  return await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/despiece/${id}`, data, config)
}

export const getCountDataMap2d = async (id: number, searchType: number) => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/count-data-map2d/${id}?search_type=${searchType}`)
}