import CreateDespieceBtn from '@/components/admin/despieces/create-despiece-btn'
import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth'
import React from 'react'
import DespiecesTable from './despieces-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PlansMap from '@/components/maps/plans-map'

const getDataDespieces = async (token: any): Promise<any[]> => {
  // const response = await getUsers()
  const rpta = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/despieces`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  })
  const response = await rpta.json()

  return response.data
}

export default async function Despieces() {

  const session = await getServerSession(authOptions)
  const response = await getDataDespieces(session?.access_token)

  return (
    <div className='h-full w-full'>
      {/* <Tabs defaultValue="despieces" className="h-full w-full">
        <TabsList>
          <TabsTrigger value="despieces">Despieces</TabsTrigger>
          <TabsTrigger value="interactives">Interactivos</TabsTrigger>
        </TabsList>
        <TabsContent value="despieces"> */}
          <CreateDespieceBtn />
          <DespiecesTable data={response} />
        {/* </TabsContent>
        <TabsContent value="interactives">
          <PlansMap/>
        </TabsContent> */}
      {/* </Tabs> */}

    </div>
  )
}
