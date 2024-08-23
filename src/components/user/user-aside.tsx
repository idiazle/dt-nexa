import Image from 'next/image'
import React from 'react'
import UserGrInfoMenu from './user-gr-info-menu'
import UserAreaMenu from './user-area-menu'
import { ChangeTheme } from '../change-theme'
import { EntityStructure } from '@/lib/utils'
import { getEntities } from '@/api/admin/entities-api'


const getData = async (): Promise<EntityStructure[]> => {
  try {
    const response = await getEntities()
    console.log(response.data.data);
    return response.data.data as EntityStructure[]

  } catch (error) {
    throw new Error("error")
  }
}

export default async function UserAside() {

  const optionArray = [
    {
      id: 1,
      name: 'Detalles del proyecto'
    },
    {
      id: 2,
      name: 'Detalles otros'
    }
  ]
  const areaArray = [
    {
      id: 1,
      name: 'Area 1'
    },
    {
      id: 2,
      name: 'Area 2'
    }
  ]

  const dataAreas = await getData()

  

  return (
    <div className='bg-[#001d39] w-full h-full p-7 flex flex-col text-white'>
      {/* <ChangeTheme/> */}
      <div className='flex justify-center items-center mb-5'>
        <Image
          style={{
            width: 'auto',
            height: 'auto'
          }}
          src="/img/icons/login-logo.png"
          width={175}
          height={175}
          alt="Picture of the author21421"
          priority
        />
      </div>
      {/* Información General */}
      <div className='flex flex-col justify-center items-center mt-8 w-full overflow-hidden h-1/2'>
        <div className='w-full border-b border-white'>
          <h4 className='text-sm w-full'>Información General</h4>
        </div>
        <UserGrInfoMenu data={optionArray} />

      </div>

      <div className='flex flex-col justify-start items-center w-full overflow-hidden h-1/2'>
        <div className='w-full border-b border-white'>
          <h4 className='text-sm w-full'>Áreas</h4>
        </div>
        <UserAreaMenu data={dataAreas} />

      </div>

    </div>
  )
}
