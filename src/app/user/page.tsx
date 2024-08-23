import React, { Suspense } from 'react'
import { DataTable } from './data-table'
import { columns, Payment } from './columns-table'
import { getEntities } from '@/api/admin/entities-api'
import UserRenderTitle from '@/components/user/user-render-title'
import UserContainer from '@/components/user/user-container'
import axiosInstance from '@/api/axios/axios-instance'




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



export default async function User() {
  // console.log(session);

  const data = await getData()



  return (
    <Suspense fallback={<p>Loading</p>}>
      <UserContainer data={data} />
    </Suspense>
  )
}
