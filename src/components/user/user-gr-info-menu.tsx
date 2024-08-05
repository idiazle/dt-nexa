'use client'
import Image from 'next/image'
import React from 'react'

export default function UserGrInfoMenu() {
    return (
        <button className='flex flex-row justify-start items-center gap-1 hover:bg-white/30 p-2 rounded'>
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
            <p className='text-xs text-left'>Detalles del proyecto Salares Norte</p>
        </button>
    )
}
