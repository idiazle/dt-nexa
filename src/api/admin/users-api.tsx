import { type UserStructure } from '@/lib/utils'
import axios from 'axios'
import axiosInstance from '../axios/axios-instance'

export const getUsers = async () => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/users`)
}

export const postUser = async (data: any) => {
  const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/register`, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
  return res
}

export const getUserById = async (id: number) => {
  const res = await axiosInstance.get<{
    data: UserStructure
  }>(`${process.env.NEXT_PUBLIC_BACK_URL}/user/${id}`)
  return res
}
export const putUserById = async (id: number, data: any) => {
  const res = await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/user/${id}`, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
  return res
}
export const deleteUserById = async (id: number) => {
  const res = await axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/user/${id}`)
  return res
}

export const getPermissions = async () => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/permissions`)
}
export const postGroup = async (data: any) => {
  return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/groups`, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
}
export const putGroup = async (id: number, data: any) => {
  return await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/group/${id}`, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
}
export const getGroupById = async (id: number) => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/group/${id}`)
}
export const deleteGroupById = async (id: number) => {
  return await axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/group/${id}`)
}
export const getGroups = async () => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/groups`)
}
