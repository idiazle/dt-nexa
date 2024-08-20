'use client'
import React, { useContext } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { OptionAsideContext } from '@/context/option-aside-context'

interface UserAreaMenuStructure {
    data: any
}
export default function UserAreaMenu({ data }: UserAreaMenuStructure) {

    const router = useRouter()
    const {option, setOption} = useContext(OptionAsideContext)

    const handleClick = (obj: any) => {
        router.replace(`/user?option-type=2`)
        setOption(obj)
    }

    


    return (
        <div className='flex flex-row justify-center items-center gap-3 flex-wrap overflow-auto mt-4 w-full'>
            {
                data.map((obj: any, index: number) => {
                    return (
                        <button onClick={() => handleClick(obj)} key={index} className='p-2 rounded-md flex flex-col justify-center items-center overflow-hidden hover:bg-white/40'>
                            <div className='w-[75px] h-[75px] bg-[#0c6063] rounded flex flex-col justify-center items-center'>
                                <Image
                                    style={{
                                        width: 'auto',
                                        height: 'auto'
                                    }}
                                    src={'/img/icons/login-logo.png'}
                                    height={50}
                                    width={50}
                                    priority
                                    alt='daw'
                                />
                            </div>
                            <p className='text-[10px]'>{obj.name}</p>
                        </button>
                    )
                })
            }
        </div>

    )
}
