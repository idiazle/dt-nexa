import CreateEquipmentBtn from '@/components/admin/equipments/create-equipment-btn'
import React from 'react'
import EquipmentsTable from './equipments-table'
import { EquipmentStructure } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

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


  return (
    <div className='h-full w-full'>
      <CreateEquipmentBtn />
      <EquipmentsTable data={data} />
    </div>
  )
}
