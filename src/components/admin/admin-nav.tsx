'use client'
import { useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import React from 'react'

export default function AdminNav() {
    const theme = useTheme()
    const colorNav = theme.theme === 'dark' ? 'bg-[#030F2E]' : 'bg-gradient-to-r from-[#0078d4] to-red-500'
    const { data: session } = useSession()

    return (
        <nav className={`p-5 flex flex-row justify-between items-center w-full h-[48px] ${colorNav} h-[48px]`}>
            <div>
                <Image
                    src="/img/icons/default-icon.png"
                    height={42}
                    width={42}
                    objectFit='contain'
                    alt={"icon-enterprise"}
                />
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
