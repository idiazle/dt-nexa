import CreateAuthorizBtn from '@/components/admin/authorizations/create-authoriz-btn'
import React from 'react'
import AuthorizationTable from './authorization-table'
import { AuthorizationStructure } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

const getData = async (token: any): Promise<AuthorizationStructure[]> => {
  // const response = await getEntities()
  const rpta = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/groups`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: 'no-store'
    })
  const response = await rpta.json()
  // console.log(rpta)


  return response.data.sort(function (a: any, b: any) {
    return a.id - b.id
  })
}

export default async function Authorizations() {
  const session = await getServerSession(authOptions)

  const data = await getData(session?.access_token)
  return (
    <div className='h-full w-full'>
      <CreateAuthorizBtn />
      <AuthorizationTable data={data} />
    </div>
  )
}
