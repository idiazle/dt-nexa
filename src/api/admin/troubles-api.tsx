import axios from 'axios'
import axiosInstance from '../axios/axios-instance'


export const getTroubles = async () => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/troubles`)
}

export const getTroubleByEqId = async (id: number) => {
  return await axiosInstance.get<{
    data: any[]
  }>(`${process.env.NEXT_PUBLIC_BACK_URL}/trouble/equipment/${id}`)
}

export const postTroubles = async (data: any) => {
  return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/troubles`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const getTroubleById = async (id: number) => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/trouble/${id}`)
}
export const deleteTroubleById = async (id: number) => {
  return await axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/trouble/${id}`)
}

export const putTroubleById = async (id: number, data: any) => {
  return await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/trouble/${id}`, JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
