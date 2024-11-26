import { EquipmentStructure } from "@/lib/utils"
import axiosInstance from "../axios/axios-instance"

export const getEquipments = async () => {
    return await axiosInstance.get<{
      data: EquipmentStructure[]
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/equipments`)
  }
  
  export const getManufacturers = async () => {
    return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/manufacturers`)
  }
  
  export const getEquipmentById = async (id: number) => {
    return await axiosInstance.get<{
      data: EquipmentStructure
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/equipment/${id}`)
  }
  
  export const postEquipment = async (formValue: any) => {
    return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/entity`, formValue)
  }
  
  export const deleteEquipment = async (id: number) => {
    return await axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/entity/${id}`)
  }
  
  export const putEquipment = async (id: number, formValue: any) => {
    return await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/equipment/${id}`, formValue)
  }
  
  export const getEquipmentsByEntityId = async(id:number) =>{
    return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/equipmentsByEntity/${id}`)
  }