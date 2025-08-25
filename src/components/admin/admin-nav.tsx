'use client'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { UserInfoMenu } from '../auth/user-info-menu'

export default function AdminNav() {
  const theme = useTheme()
  const colorNav = 'bg-gradient-to-r from-[#434140] to-[#ff540a]'
  const { data: session } = useSession()

  return (
    <nav className={`p-5 flex flex-row justify-between items-center w-full h-[54px] bg-[#002645] text-white`}>
      <div
        onClick={() => window.location.href = '/menu'}
        className='flex flex-row gap-3 justify-start items-center w-1/3'>
        <Image
          src="/img/icons/portal-digital.png"
          height={45}
          width={45}
          alt={"nexa-logo"}
          className='rounded-md contain'
        />
        <Image
          src="/img/nexa_logo.png"
          height={100}
          width={100}
          alt={"nexa-logo"}
          className='bg-white rounded-md contain'
        />
      </div>
      <div className=' flex flex-col justify-center items-center w-1/3'>
        <h1 className='text-white font-bold text-sm'>Administración - CAJAMARQUILLA</h1>
      </div>
      <div className='flex flex-row gap-5 items-center w-1/3 justify-end text-sm'>
        <UserInfoMenu />
      </div>
      {/* <div className='flex flex-row justify-center items-center gap-5'>
        <h1 className='font-bold'>{session?.user.username}</h1>
        <Button onClick={async () => { await signOut() }}>
          Salir
        </Button>
      </div> */}
    </nav>
  )
}
