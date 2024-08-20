import PlansMap from '@/components/maps/plans-map'
import { authOptions } from '@/lib/authOptions'
import { PlanStructure } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import React from 'react'


const getData = async (id: number, token: string): Promise<PlanStructure> => {
  // const response = await getEntities()
  const rpta = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/plan/${id}`,
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

  const data = await getData(request.searchParams['plan-id'], String(session?.access_token))




  return (
    <PlansMap plan={data} />
  )
}
