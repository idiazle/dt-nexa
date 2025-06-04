import { getMapPlans2dIcons } from '@/api/admin/maps2d-api'
import { BtnCreateIcon } from '@/components/admin/map2dicons/btn-create-icon'
import IconImageCard from '@/components/admin/map2dicons/icon-image-card'
import { IconStructure, MenuIconsStructure } from '@/lib/utils'
import React from 'react'


const getApiMapPlans2dIcons = async (): Promise<IconStructure[]> => {
  const response = await getMapPlans2dIcons()
  if (response.status !== 200) {
    throw new Error('Error en respuesta')
  }
  return response.data.data
}
export default async function Map2dIcons() {
  const data = await getApiMapPlans2dIcons()
  console.log("MY DATA", data);

  return (
    <div className='w-full h-full'>
      <BtnCreateIcon />
      <div className='flex flex-row justify-center items-center gap-10 z-0'>

        {
          data.map((icon: IconStructure) => {
            return (
              <IconImageCard key={icon.id} icon={icon} />
            )
          })
        }
      </div>
    </div>
  )
}
