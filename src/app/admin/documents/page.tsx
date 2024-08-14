import CreateDocBtn from '@/components/admin/documents/create-doc-btn'
import React from 'react'
import DocumentsTable from './documents-table'
import { DocumentStructure } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'


const getData = async (page: number, token: any): Promise<any> => {
  const rpta = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/documents?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: 'no-store'
    })
  const response = await rpta.json()
  return response
}


export default async function Documents({
  searchParams: { page = '1' }
}: {
  searchParams: {
    page: string
  }
}) {
  let pageNumber:number

  try {
    pageNumber = parseInt(page)
    if (pageNumber < 1) pageNumber = 1
  } catch (e) {
    pageNumber = 1
  }

  const session = await getServerSession(authOptions)
  const data = await getData(pageNumber, session?.access_token)
  

  return (
    <div className='h-full w-full'>

      {/* <DataTable columns={columns} data={data} /> */}
      <CreateDocBtn />
      <DocumentsTable data={data} pageNumber={pageNumber} totalPages={data.total_pages} rowsPerPage={data.rows_quantity} totalDocuments={data.count}/>
    </div>
  )
}
