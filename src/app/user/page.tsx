import React from 'react'
import { DataTable } from './data-table'
import { columns, Payment } from './columns-table'
import { getSession } from 'next-auth/react'
import NextAuth, { getServerSession } from 'next-auth'
import { Button } from '@/components/ui/button'
import { authOptions } from '@/lib/authOptions'

const getDatax = async () => {
  const session = await getServerSession(authOptions)
  console.log(session?.access_token);
  
  try {
    const rpta = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/entity`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        },
        cache: 'no-store'
      })
      const response = await rpta.json()
      if (rpta.status === 401) {
        console.log("Token expired");
        const session = await getServerSession(authOptions)
        console.log(session?.access_token);

    }

    return response
  } catch (error) {
    console.log(error);
    return error
  }
}

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



export default async function page() {
  // console.log(session);

  const data = await getDatax()
  console.log(data);
  



  return (
    <div className='h-full w-full bg-white text-black pr-7 flex flex-col overflow-auto'>
      <div className='border-b-2 border-slate-600 pt-8 pb-1 pl-7'>
        <h1 className='text font-semibold'>Detalles del Proyecto Salares Norte</h1>
      </div>
      <div className='mt-8 ml-10 overflow-hidden'>
        {
          JSON.stringify(data)
        }
        {/* <DataTable columns={columns} data={data} /> */}
        {/* <h1>wadpkwapd</h1> */}
      </div>
    </div>
  )
}
