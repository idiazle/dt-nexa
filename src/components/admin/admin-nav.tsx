'use client'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'

export default function AdminNav() {
  const theme = useTheme()
  const colorNav = 'bg-gradient-to-r from-[#434140] to-[#ff540a]'
  const { data: session } = useSession()

  return (
    <nav className={`p-5 flex flex-row justify-between items-center w-full h-[54px] ${colorNav} h-[48px]`}>
      <div
        onClick={() => window.location.href = '/menu'}
      className='flex flex-row gap-3 justify-start items-center w-full'>
        <Image
          src="/img/nexa_logo.png"
          height={40}
          width={40}
          objectFit='contain'
          alt={"icon-enterprise"}
          className='rounded-sm bg-white'
        />
        <h1 className='text-white font-bold'>CAJAMARQUILLA</h1>
      </div>
      <div className='flex flex-row justify-center items-center gap-5'>
        <h1 className='font-bold'>{session?.user.username}</h1>
        <Button onClick={async () => { await signOut() }}>
          Salir
        </Button>
      </div>
    </nav>
  )
}
