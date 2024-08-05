import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'

export default function UserAreaMenu() {
    return (
        <button className='flex flex-col gap-1 justify-center items-center overflow-hidden'>
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
            <p className='text-[10px]'>Instalación Mina</p>
        </button>
    )
}
