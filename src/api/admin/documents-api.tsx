import { AllAuxListStructure, ObjVsDocStructure } from '@/lib/utils'
import axiosInstance from '../axios/axios-instance'
export const getDocuments = async (page: number, token: any) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/documents?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  })
  return res
}

export const getDocumentsNoToken = async (page: number) => {
  const res = await axiosInstance(`${process.env.NEXT_PUBLIC_BACK_URL}/documents?page=${page}`)
  return res
}
export const getDocumentById = async (id: number) => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/document/${id}`)
}
export const getAllTypes = async () => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/allAuxTypes`)
}

export const getOptionsById = async (data: { ids: string }) => {
  return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/documentsAux/parent_type`, data)
}

export const postDocument = async (data: any) => {
  return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/documents`, data
  )
}
export const postDocVendor = async (data: any) => {
  return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/docVendor`, data
  )
}

export const postDocClient = async (data: any) => {
  return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/docClient`, data
  )
}

export const uploadDocument = async (id: number, data: FormData, config: any) => {
  return await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/uploadDocument/${id}`, data, config)
}

export const referencesById = async (id: number) => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/refToDocs/${id}`)
}

export const getDocumentsLightList = async () => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/documents-light-list`)
}

export const deleteDocument = async (id: number) => {
  return await axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/document/${id}`)
}

export const postObjVsDocs = async (body: ObjVsDocStructure) => {
  return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/objVsDocs`, body, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getObjVsDoc = async (id: number) => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/objVsDoc/${id}`)
}

export const getDocVsDocRef = async (id: number) => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/refToDocs/${id}`)
}

export const deleteReference = async (idEnlace: number) => {
  return await axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/objVsDoc/${idEnlace}`)
}

export const postRefDocToDoc = async (data: any) => {
  return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/refToDocs`, data)
}

export const putDocumentById = async (id: number, data: any) => {
  return await axiosInstance.put(`${process.env.NEXT_PUBLIC_BACK_URL}/document/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  )
}

export const deleteDocVsDocId = async (id: number) => {
  return await axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/refToDocs/${id}`)
}

export const getDocumentsByArea = async (id: number, type: string) => {
  return await axiosInstance.get<{
    data: any[]
  }>(`${process.env.NEXT_PUBLIC_BACK_URL}/docsById/${id}/${type}`)
}

export const getDocsByEquipmentIdByAreaid = async (id: number) => {
  return await axiosInstance.get<{
    data: any[]
  }>(`${process.env.NEXT_PUBLIC_BACK_URL}/docs-by-eq/${id}`)
}

export const getEntityVideo = async (id: number) => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/entity-video/${id}`)
}

export const getAllAuxList = async () => {
  return await axiosInstance.get<{
    data: AllAuxListStructure
  }>(`${process.env.NEXT_PUBLIC_BACK_URL}/all-aux-list`)
}

export const getSearchDocuments = async (page: number, data: any) => {
  const rpta = await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/documentSearch/?title=${data.title}&filename=${data.filename}&author=${data.author}&tag=${data.tag}&entity=${data.entity}&module=${data.module}&discipline=${data.discipline}&type=${data.type}&confidential=${data.confidential}&date_doc=${data.date_doc}&date_load=${data.date_load}&date_expired=${data.date_expired}&days_expired=${data.days_expired}&status_vendor=${data.status_vendor}&code_vendor=${data.code_vendor}&revision_vendor=${data.revision_vendor}&rev_vendor_by=${data.rev_vendor_by}&status_client=${data.status_client}&code_client=${data.code_client}&revision_client=${data.revision_client}&rev_client_by=${data.rev_client_by}&rev_client_alt=${data.rev_client_alt}&po_contract=${data.po_contract}&page=${page}`)
  return rpta
}
export const getSearchDocumentsNoCache = async (page: number, data: any, token:string) => {
  const rpta = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/documentSearch/?title=${data.title}&filename=${data.filename}&author=${data.author}&tag=${data.tag}&entity=${data.entity}&module=${data.module}&discipline=${data.discipline}&type=${data.type}&confidential=${data.confidential}&date_doc=${data.date_doc}&date_load=${data.date_load}&date_expired=${data.date_expired}&days_expired=${data.days_expired}&status_vendor=${data.status_vendor}&code_vendor=${data.code_vendor}&revision_vendor=${data.revision_vendor}&rev_vendor_by=${data.rev_vendor_by}&status_client=${data.status_client}&code_client=${data.code_client}&revision_client=${data.revision_client}&rev_client_by=${data.rev_client_by}&rev_client_alt=${data.rev_client_alt}&po_contract=${data.po_contract}&page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  })
  return rpta
}

export const getTemporalFiles = async () => {
  return await axiosInstance.get(`${process.env.NEXT_PUBLIC_BACK_URL}/temporalFiles`)
}
export const deleteTemporalFiles = async (id: number) => {
  return await axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACK_URL}/temporalFile/${id}`)
}

export const postTemFileToDoc = async (data: any) => {
  return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/tempFileToDoc`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const postTemporalFiles = async (data: any) => {
  return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACK_URL}/temporalFiles`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
