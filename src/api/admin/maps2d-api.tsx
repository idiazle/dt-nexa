import { IconStructure, Map2dShapesStructure, Map2dStructure, MenuIconsStructure } from "@/lib/utils"
import axiosInstance from "../axios/axios-instance"

export const getMapPlans2dIcons = async () => {
    return await axiosInstance.get<{
        data: IconStructure[]
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plans-2d-icons`)
}

export const deleteMapPlans2dIcon = async (id: number) => {
    return await axiosInstance.delete<{
        data: IconStructure[]
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plan-2d-icon/${id}`)
}

export const putMapPlans2dIcon = async (id: number, data: any) => {
    return await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plan-2d-icon/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}


export const postMapsPlans2dIcons = async (data: any) => {
    return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plans-2d-icons`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}


export const getMapPlans2d = async () => {
    return await axiosInstance.get<{
        data: Map2dStructure[]
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plans-2d`)
}

export const getMapPlans2dById = async (id: number) => {
    return await axiosInstance.get<{
        data: Map2dStructure
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plan-2d/${id}`)
}

export const deleteMapPlans2d = async (id: number) => {
    return await axiosInstance.delete<{
        data: Map2dStructure
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plan-2d/${id}`)
}

export const putMapPlans2d = async (id: number, data: any) => {
    return await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plan-2d/${id}`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}


export const postMapsPlans2d = async (data: any) => {
    return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plans-2d`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}



// MAPAS SHAPES 

export const getMapShapes2d = async () => {
    return await axiosInstance.get<{
        data: Map2dShapesStructure[]
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plans-2d-shapes`)
}

export const getMapShape2dById = async (id: number) => {
    return await axiosInstance.get<{
        data: Map2dShapesStructure
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plan-2d-shape/${id}`)
}

export const deleteMapShape2dById = async (id: number) => {
    return await axiosInstance.delete<{
        data: Map2dShapesStructure
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plan-2d-shape/${id}`)
}

export const putMapShape2dById = async (id: number, data: any) => {
    return await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plan-2d-shape/${id}`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}


export const postMapsShapes2d = async (data: any) => {
    return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plans-2d-shapes`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}




export const getShapesByMapId = async (id: number) => {
    return await axiosInstance.get<{
        data: Map2dShapesStructure[]
    }>(`${process.env.NEXT_PUBLIC_BACK_URL}/map-only-shapes/${id}`)

}