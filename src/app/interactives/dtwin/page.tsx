'use client'
import React, { Suspense, useState } from 'react'
import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin'
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer'
import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FaBars } from 'react-icons/fa6'
import { TbView360Number } from 'react-icons/tb'
import { UserInfoMenu } from '@/components/auth/user-info-menu'
import OptionsNav from '@/components/interactives/options-nav'
import { useSearchParams } from 'next/navigation'
import NavBarInteractives from '@/components/interactives/navBarInteractives'

function Dtwin() {
  const plugins = [[AutorotatePlugin, { start: true }]] as any

  return (
    <>
      {/* <div className='absolute z-10 flex flex-row h-[52px] w-full justify-between items-center bg-[#00203a] border-b border-gray-300 text-white px-3'> */}
      <Suspense fallback={<div className='h-[52px] w-full'></div>}>
      <NavBarInteractives />

      </Suspense>
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
      <Suspense fallback={<div></div>}>
        <OptionsNav />
      </Suspense>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-15'>
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
