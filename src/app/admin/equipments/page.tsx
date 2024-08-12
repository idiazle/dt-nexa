import CreateEquipmentBtn from '@/components/admin/equipments/create-equipment-btn'
import React from 'react'
import EquipmentsTable from './equipments-table'
import { EntityStructure, EquipmentStructure, Manufacturer } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { getManufacturers } from '@/api/admin/equipments-api'
import { getEntities } from '@/api/admin/entities-api'
import axiosInstance from '@/api/axios/axios-instance'


const getDataManufacturers = async (): Promise<Manufacturer[]> => {
  const response = await getManufacturers()
  if (response.status !== 200) {
    throw new Error('Error en respuesta')
  }
  return response.data.data
}
const getDataEntities = async (): Promise<EntityStructure[]> => {
  const response = await getEntities()
  if (response.status !== 200) {
    throw new Error('Error en respuesta')
  }
  return response.data.data
}


const getData = async (token: any): Promise<EquipmentStructure[]> => {
  // const response = await getEntities()
  const rpta = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/equipments`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: 'no-store'
    })
  const response = await rpta.json()

  // if (rpta.status === 401) {
  //   throw new OwnExpTokenError('Token vencido, se redirigirá al login', 401)
  // } else if (rpta.status === 403) {
  //   throw new OwnExpTokenError('Prohibited', 403)
  // } else if (rpta.status !== 200) {
  //   throw new Error('Error en respuesta')
  // }
  
  return response.data
}


export default async function Equipments() {
  const session = await getServerSession(authOptions)

  const data = await getData(session?.access_token)
  const entities = await getDataEntities()
  const manufacturers = await getDataManufacturers()
  

  return (
    <div className='h-full w-full'>
      <CreateEquipmentBtn entities={entities} equipments={data} manufacturers={manufacturers}/>
      <EquipmentsTable entities={entities} manufacturers={manufacturers} data={data} />
    </div>
  )
}
