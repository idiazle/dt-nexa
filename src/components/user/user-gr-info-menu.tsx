'use client'
import { OptionAsideContext } from '@/context/option-aside-context'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'

interface infoObject {
    data: any
}
export default function UserGrInfoMenu({ data }: infoObject) {
    const router = useRouter()
    const {option, setOption} = useContext(OptionAsideContext)

    const handleClick = (obj: any) => {
        router.replace(`/user?option-type=1`)
        setOption(obj)
    }


    
    

    return (
        <div className='flex flex-col justify-center items-center p-2 gap-2 overflow-auto w-full'>
            {
                data.map((obj: any, index: number) => {
                    return (
                        <button onClick={() => handleClick(obj)} key={index} className='flex flex-row justify-start w-full items-center gap-1 hover:bg-white/30 p-2 rounded'>
                            <Image
                                style={{
                                    width: 'auto',
                                    height: 'auto'
                                }}
                                src="/img/icons/default-icon.png"
                                width={40}
                                height={40}
                                alt="Picture of the authord2x1"
                                priority
                            />
                            <p className='text-xs text-left'>{obj.name}</p>
                        </button>
                    )
                })
            }
        </div>

    )
}
