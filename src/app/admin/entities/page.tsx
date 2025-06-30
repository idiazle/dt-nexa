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

  const plants = data.filter((obj: EntityStructure) => obj.type === 4)

  const areas = data.filter((obj: EntityStructure) => obj.type === 5)



  return (
    <div className=' w-full overflow-hidden'>
      <CreateEntityBtn />
      {/* <DataTable columns={columns} data={data} /> */}
      <div className='flex flex-col justify-between items-start mt-5 border-t pt-5 h-full overflow-auto'>
        <div className='w-full'>
          <h1 className='font-semibold text-2xl'>Plantas</h1>
          <EntitiesTable data={plants} />
        </div>
        {/* <div className='h-full border-l-2'></div> */}
        <div className='w-full'>
          <h1 className='font-semibold text-2xl'>Áreas</h1>
          <EntitiesTable data={areas} />
        </div>
      </div>
    </div>
  )
}
