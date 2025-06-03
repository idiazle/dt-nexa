import PlansMap from '@/components/maps/plans-map'
import { authOptions } from '@/lib/authOptions'
import { Map2dStructure } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import React from 'react'


const getData = async (id: number, token: string): Promise<Map2dStructure> => {
  // const response = await getEntities()
  const rpta = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/map-plan-2d/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: 'no-store'
    })
  const response = await rpta.json()

  return response.data
}


export default async function Interactives(request: any) {

  const session = await getServerSession(authOptions)

  const data = await getData(request.searchParams['map-id'], String(session?.access_token))

// console.log("AW", session?.access_token);



  return (
    <PlansMap data={data} />
  )
}
