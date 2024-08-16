import CreatePlanBtn from '@/components/admin/plans/create-plan-btn'
import { authOptions } from '@/lib/authOptions'
import { PlanStructure } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import React from 'react'
import PlansTable from './plans-table'

const getData = async (token: any): Promise<PlanStructure[]> => {
  // const response = await getEntities()
  const rpta = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/plans`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  })
  const response = await rpta.json()

  return response.data
}
export default async function Plans() {
  const session = await getServerSession(authOptions)
  const data = await getData(session?.access_token)

  return (
    <div className='h-full w-full'>

      {/* <DataTable columns={columns} data={data} /> */}
      <CreatePlanBtn />
      {/* <UsersTable data={response} /> */}
      <PlansTable data={data} />
    </div>
  )
}
