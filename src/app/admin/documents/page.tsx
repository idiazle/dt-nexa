import CreateDocBtn from '@/components/admin/documents/create-doc-btn'
import React from 'react'
import DocumentsTable from './documents-table'
import { DocumentStructure } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'


const getData = async (page: number, token: any): Promise<DocumentStructure[]> => {
  const rpta = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/documents?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: 'no-store'
    })
  const response = await rpta.json()
  return response.data
}


export default async function Documents() {
  const session = await getServerSession(authOptions)
  const data = await getData(1, session?.access_token)

  return (
    <div className='h-full w-full'>

      {/* <DataTable columns={columns} data={data} /> */}
      <CreateDocBtn />
      <DocumentsTable data={data} />
    </div>
  )
}
