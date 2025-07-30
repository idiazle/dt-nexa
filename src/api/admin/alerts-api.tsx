import axiosInstance from "../axios/axios-instance";

export const getAllAlerts = async () => {
  const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/notifications`)
  return response
}

export const getNotifications = async () => {
  const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/notifications`)
  return response
}

export const getNotificationById = async (id: number) => {
  const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/notification/${id}`)
  return response
}

export const putNotificationById = async (id: number, data: any) => {
  const response = await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/notification/${id}`, data)
  return response
}

export const postInspection = async (data: any) => {
  const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/inspections`, data)
  return response
}

export const postNotification = async (data: any) => {
  const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/notifications`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}
