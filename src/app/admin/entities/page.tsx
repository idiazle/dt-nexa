import EntityDialog from '@/components/admin/entities/entity-dialog'
import FormEntity from '@/components/admin/entities/form-entity'
import React from 'react'
import { columns } from './columns'
import { DataTable } from './data-table'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { EntityStructure } from '@/lib/utils'


const getData = async (token: any): Promise<EntityStructure[]> => {
  // const response = await getEntities()
  const rpta = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/entity`,
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
  return response.data.filter((obj: EntityStructure) => obj.type !== 6)
}


export default async function Entities() {

  const session = await getServerSession(authOptions)

  const data = await getData(session?.access_token)


  return (
    <div className='h-full w-full'>
      <div className='flex flex-row justify-between items-center'>
        <h1 className='font-semibold text-2xl'>Entidades: Plantas y Áreas</h1>
        <EntityDialog id={null} />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
