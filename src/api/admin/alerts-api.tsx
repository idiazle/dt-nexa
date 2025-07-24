import axiosInstance from "../axios/axios-instance";

export const getAllAlerts = async () => {
  const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/notifications`)
  return response
}



export const getNotifications = async () => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/notifications`)
}

export const getNotificationById = async (id: number) => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/notification/${id}`)
}

export const putNotificationById = async (id: number, data: any) => {
  return await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/notification/${id}`, data)
}

export const postInspection = async (data: any) => {
  return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/inspections`, data)
}

export const postNotification = async (data: any) => {
  return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/notifications`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
