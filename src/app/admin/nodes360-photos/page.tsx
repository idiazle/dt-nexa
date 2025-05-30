import React from 'react'
import { getNodes360 } from '@/api/admin/nodes360-api'
import { BtnCreateNode } from '@/components/admin/nodes360/btn-create-node'
import Nodes360PhotoTable from './nodes360-photos-table'

const getData = async (): Promise<any> => {
  try {
    const response = await getNodes360()
    return response.data.data 
  } catch (error) {
    return error
  }
}

export default async function Nodes360Photos() {
  const data = await getData()
  
  return (
    <div className='h-full w-full'>
      <BtnCreateNode />
      <Nodes360PhotoTable data={data}/>
    </div>
  )
}
