import axiosInstance from "../axios/axios-instance";

export const getAllAlerts = async () => {
  const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/notifications`)
  return response
}