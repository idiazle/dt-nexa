import axiosInstance from "../axios/axios-instance";

export const getAllImagenes = async () => {
  const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/gallery-eq`)
  return response
}

export const postImagenesByEquipment = async (data: any) => {
  const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/gallery-eq`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}

export const getImagenesByEquipment = async (id: number) => {
  const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/gallery-by-eq/${id}`)
  return response
}

export const deleteImagenesByEquipment = async (id: number) => {
  const response = await axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/gallery-eq/${id}`)
  return response
}