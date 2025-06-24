'use client'
import React, { useState } from 'react'
import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin'
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer'
import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FaBars } from 'react-icons/fa6'
import { TbView360Number } from 'react-icons/tb'
import { UserInfoMenu } from '@/components/auth/user-info-menu'
import OptionsNav from '@/components/interactives/options-nav'

function Dtwin() {
  const plugins = [
    [AutorotatePlugin, {
      start: true
    }
    ]
  ] as any
  const [open360list, setOpen360List] = useState<boolean>(false)

  return (
    <>
      {/* <div className='absolute z-10 flex flex-row h-[52px] w-full justify-between items-center bg-[#00203a] border-b border-gray-300 text-white px-3'> */}
      <div className='absolute z-10 flex flex-row h-[52px] w-full justify-between items-center bg-[#002645] border-b border-gray-300 text-white px-3'>
        <div
          onClick={() => window.location.href = '/menu'}
          className='flex flex-row gap-3 w-1/3 items-center justify-start'>
          <Image
            src="/img/icons/portal-digital.png"
            height={45}
            width={45}
            alt={"nexa-logo"}
            className='rounded-md contain'
          />
          <Image
            src="/img/menu-icons/gemelo_digital.png"
            height={50}
            width={50}
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
        <div className='flex flex-col justify-center items-center w-1/3'>
          <h1 className='text-xl font-bold'>GEMELO DIGITAL DE CONFIABILIDAD</h1>
        </div>
        <div className='flex flex-row gap-5 items-center w-1/3 justify-end'>
          <UserInfoMenu />
        </div>
      </div>
      <ReactPhotoSphereViewer
        src='/img/fondo_presentacion.jpg'
        width='100%'
        height='100%'
        navbar={false}
        container={'container-360'}
        plugins={plugins}
        mousemove={false}
        mousewheel={false}
        loadingImg='/img/menu-icons/gemelo_digital.png'
      />
      <OptionsNav />
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 opacity-15'>
        <Image
          src="/img/nexa_logo.png"
          height={500}
          width={500}
          alt={"nexa-logo"}
          className='bg-white rounded-md contain'
        />
      </div>
    </>
  )
}

export default Dtwin
