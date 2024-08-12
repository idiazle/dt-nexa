import CreateUserBtn from '@/components/admin/users/create-user-btn'
import React from 'react'
import UsersTable from './users-table'
import { getServerSession } from 'next-auth'
import { UserStructure } from '@/lib/utils'
import { authOptions } from '@/lib/authOptions'


const getDataUsers = async (token: any): Promise<UserStructure[]> => {
  // const response = await getUsers()
  const rpta = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  })
  const response = await rpta.json()

  return response.data
}

export default async function Users() {
  const session = await getServerSession(authOptions)
  const response = await getDataUsers(session?.access_token)
  return (
    <div className='h-full w-full'>

      {/* <DataTable columns={columns} data={data} /> */}
      <CreateUserBtn />
      <UsersTable data={response} />
    </div>
  )
}
