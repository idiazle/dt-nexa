'use client'
import React, { useState } from 'react'
import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin'
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer'
import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FaBars } from 'react-icons/fa6'
import { TbView360Number } from 'react-icons/tb'
import { UserInfoMenu } from '@/components/auth/user-info-menu'

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
      <div className='absolute z-10 flex flex-row h-[52px] w-full justify-between items-center bg-[#022799] border-b border-gray-300 text-white px-3'>
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
        loadingImg='none'
      />
      <div className='absolute flex flex-row-rever gap-2 bottom-3 left-1/2 -translate-x-1/2 z-50 p-2 rounded-md'>
        <div className='flex flex-col items-center w-32 gap-2'>
          <a href={"/interactives?map-id=10006&map-type=1"} className="font-bold text-3xl p-4 rounded-full w-24 h-24 flex items-center justify-center text-black bg-white border-2 border-[#022799] hover:bg-[#022799] hover:text-white cursor-pointer">PFD</a>
          <span className='text-xs text-center bg-slate-700 bg-opacity-50 p-1'>Diagrama de Flujo de Confiabilidad</span>
        </div>
        <div className='flex flex-col items-center w-32 gap-2'>
          <a href={"/interactives?map-id=10007&map-type=3"} className="font-bold text-3xl p-4 rounded-full w-24 h-24 flex items-center justify-center text-black bg-white border-2 border-[#022799] hover:bg-[#022799] hover:text-white cursor-pointer">PND</a>
          <span className='text-xs text-center bg-slate-700 bg-opacity-50 p-1'>Diagrama de Navegación de Planta</span>
        </div>
        <div className='flex flex-col items-center w-32 gap-2'>
          <a href={"#"} className="font-bold text-3xl p-4 rounded-full w-24 h-24 flex items-center justify-center text-black bg-white border-2 border-blue-600 opacity-40 cursor-default">PLD</a>
          <span className='text-xs text-center bg-slate-700 bg-opacity-20 p-1'>Diagrama Lógico Funcional</span>
        </div>
        <div className='flex flex-col items-center w-32 gap-2'>
          {
            open360list ?
              < div className='absolute flex flex-col items-center w-40 bottom-32 gap-1 mb-5 bg-white rounded-sm'>
                <div className='w-full rounded-sm text-center text-black p-1 hover:bg-[#022799] hover:text-white opacity-30 cursor-default'>Seccion 10</div>
                <a href={"/interactives/nav360?nodeId=9"} className='w-full rounded-sm text-center text-black p-1 hover:bg-[#022799] hover:text-white cursor-pointer bg-gray-100'>Seccion 20</a>
                <div className='w-full rounded-sm text-center text-black p-1 hover:bg-[#022799] hover:text-white opacity-30 cursor-default'>Seccion 25</div>
              </div>
              : null
          }
          <button
            onClick={() => { setOpen360List(!open360list) }}
            className="font-bold text-3xl p-4 rounded-full w-24 h-24 flex items-center justify-center text-black bg-white border-2 border-[#022799] hover:bg-[#022799] hover:text-white">
            <TbView360Number size={55} />
          </button>
          <span className='text-xs text-center bg-slate-700 bg-opacity-50 p-1'>Navegación 360°</span>
        </div>
      </div>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 opacity-15'>
        <Image
          src="/img/nexa_logo.png"
          height={500}
          width={500}
          alt={"nexa-logo"}
          className='bg-white rounded-md contain rounded-md'
        />
      </div>
    </>
  )
}

export default Dtwin
