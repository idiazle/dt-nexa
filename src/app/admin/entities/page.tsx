import EntityDialog from '@/components/admin/entities/entity-dialog'
import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { EntityStructure } from '@/lib/utils'
import EntitiesTable from './entities-table'
import CreateEntityBtn from '@/components/admin/entities/create-entity-btn'


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
      <CreateEntityBtn />
      {/* <DataTable columns={columns} data={data} /> */}
      <EntitiesTable data={data} />
    </div>
  )
}
