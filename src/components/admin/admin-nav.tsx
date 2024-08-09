'use client'
import { useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import React from 'react'

export default function AdminNav() {
    const theme = useTheme()
    // const colorNav = theme.theme === 'dark' ? 'bg-[#030F2E]' : 'bg-gradient-to-r from-[#aa945e] to-[#030F2E]'
    // const colorNav = 'bg-gradient-to-r from-[#aa945e] to-[#030F2E]'
    const colorNav = 'bg-gradient-to-r from-[#030F2E] to-[#aa945e]'
    const { data: session } = useSession()

    return (
        <nav className={`p-5 flex flex-row justify-between items-center w-full h-[48px] ${colorNav} h-[48px]`}>
            <div className='flex flex-row gap-3 justify-start items-center w-full'>
                <Image
                    src="/img/icons/default-icon.png"
                    height={42}
                    width={42}
                    objectFit='contain'
                    alt={"icon-enterprise"}
                />
                <h1 className='uppercase text-white'>Salares Norte</h1>
                {/* <Image
                    style={{
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain'
                    }}
                    src="/img/icons/default-icon.png"
                    width={100}
                    height={100}
                    alt="Picture of the author21421"
                    priority
                /> */}

            </div>
            <h1 className='border p-1 rounded-3xl border-white'>{session?.user.username}</h1>
        </nav>
    )
}
