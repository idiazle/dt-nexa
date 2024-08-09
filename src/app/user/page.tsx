import React from 'react'
import { DataTable } from './data-table'
import { columns, Payment } from './columns-table'
import { getEntities } from '@/api/admin/entities-api'
import UserRenderTitle from '@/components/user/user-render-title'




async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "7128ed52f",
      amount: 100,
      status: "failed",
      email: "2m@example.com",
    },
    {
      id: "7228ed52f",
      amount: 120,
      status: "pending",
      email: "dwaxm@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    {
      id: "7328ed52f",
      amount: 400,
      status: "pending",
      email: "3213m@example.com",
    },
    // ...
  ]
}

const getEntidades = async () => {
  try {
    const resp = await getEntities()
    if (resp.status === 200) {
      return resp.data.data
    }
  } catch (error: any) {
    console.log(error.message);
    if (error.message === '401') {
      // redirect('/auth/login')
    }
  }
}

export default async function User() {
  // console.log(session);

  const data = await getData()




  return (
    <div className='h-full w-full  pr-7 flex flex-col overflow-auto bg-white'>
      <div className='border-b-2 border-slate-600 pt-8 pb-1 pl-7'>
        <UserRenderTitle/>
      </div>
      {/* <p>{session?.access_token}</p> */}
      <div className='mt-8 ml-10 overflow-auto'>
        <DataTable columns={columns} data={data} />
        {/* {JSON.stringify(data)} */}
      </div>
    </div>
  )
}
