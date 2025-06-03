import { getMapShapes2d } from '@/api/admin/maps2d-api'
import { Map2dShapesStructure } from '@/lib/utils'
import React from 'react'
import Maps2dShapesTable from './map2d-shapes-table'
import CreateShapesMapBtn from '@/components/admin/map2d-shapes/create-shapes-map-btn'


const getApiMapShapes2d = async (): Promise<Map2dShapesStructure[]> => {
    const response = await getMapShapes2d()
    if (response.status !== 200) {
        throw new Error('Error en respuesta')
    }
    return response.data.data
}

export default async function Map2dShapes() {

const data = await getApiMapShapes2d()

  return (
    <div className='h-full w-full'>
         <CreateShapesMapBtn />
         <Maps2dShapesTable data={data} />
       </div>
  )
}
