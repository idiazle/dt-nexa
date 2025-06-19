import axiosInstance from "../axios/axios-instance"
// Reportes de condiciones
export const getReportsCond = async () => {
  const response =  axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/reports-cond`)
  return response
}

export const postReportCond = async (data: any) => {
  return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/reports-cond`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const editReportCondById = async (id: number, data: any) => {
  const response = await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/reports-cond/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}

export const deleteReportCondById = async (id: number) => {
  const response = await axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/reports-cond/${id}`)
  return response
}

export const getReportCondById = async (id: number) => {
  const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/reports-by-equipment/${id}`)
  return response
}