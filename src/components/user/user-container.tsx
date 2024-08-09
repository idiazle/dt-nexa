'use client'
import React from 'react'
import UserRenderTitle from './user-render-title'
import { DataTable } from '@/app/user/data-table'
import { columns } from '@/app/user/columns-table'
import {  useSearchParams } from 'next/navigation'

interface UserContainerStructure {
    data: any
}

export default function UserContainer({ data }: UserContainerStructure) {
    const optionType = useSearchParams().get('option-type')
    
    return (
        <div className={`h-full w-full pr-7 ${optionType === null ? 'hidden' : 'bg-white flex'} flex-col overflow-auto text-black`}>
            <div className='border-b-2 border-slate-600 pt-8 pb-1 pl-7'>
                <UserRenderTitle />
            </div>
            {/* <p>{session?.access_token}</p> */}
            <div className='mt-8 ml-10 overflow-auto'>
                <DataTable columns={columns} data={data} />
                {/* {JSON.stringify(data)} */}
            </div>
        </div>
    )
}
