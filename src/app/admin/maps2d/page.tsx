import CreateMapBtn from '@/components/admin/maps2d/create-map-btn'
import React from 'react'
import { DataTable } from './data-table'
import { columns } from '@/app/user/columns-table'
import { getMapPlans2d } from '@/api/admin/maps2d-api'
import Maps2dTable from './maps2d-table'

const getData = async (): Promise<any> => {
  try {
    const response = await getMapPlans2d()
    return response.data.data 
  } catch (error) {
    return error
  }
}

export default async function Maps2d() {
  const data = await getData()
  return (
    <div className='h-full w-full'>
      <CreateMapBtn />
      <Maps2dTable data={data} />
    </div>
  )
}
