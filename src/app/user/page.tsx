import React from 'react'
import { DataTable } from './data-table'
import { columns, Payment } from './columns-table'

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
  const data = await getData()
  return (
    <div className='h-full w-full bg-white text-black pr-7 flex flex-col overflow-auto'>
      <div className='border-b-2 border-slate-600 pt-8 pb-1 pl-7'>
        <h1 className='text font-semibold'>Detalles del Proyecto Salares Norte</h1>
      </div>
      <div className='mt-8 ml-10 overflow-hidden'>
        <DataTable columns={columns} data={data} />
        {/* <h1>wadpkwapd</h1> */}
      </div>
    </div>
  )
}
