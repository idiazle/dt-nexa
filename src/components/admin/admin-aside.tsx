'use client'
import React, { useEffect, useState } from 'react'
import { moduleListStructure } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { FaHouse } from "react-icons/fa6";
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'

export default function AdminAside() {
  const [changeLocation, setChangeLocation] = useState<string>('/admin')

  const moduleList: moduleListStructure[] = [
    {
      id: 1,
      icon_path: '/img/aside-icons/I_G. de entidades.png',
      icon_tooltip: 'Gestión de Entidades',
      route: '/admin/entities',
      enable: true,
      group: 'dp'
    },
    {
      id: 2,
      icon_path: '/img/aside-icons/I_G. de tags.png',
      icon_tooltip: 'Gestión de Equipos',
      route: '/admin/equipments',
      enable: true,
      group: 'dp'
    },
    {
      id: 3,
      icon_path: '/img/aside-icons/I_G. de documentos.png',
      icon_tooltip: 'Gestión de Documentos',
      route: '/admin/documents',
      enable: true,
      group: 'mio'
    },
    {
      id: 4,
      icon_path: '/img/aside-icons/imagenes.png',
      icon_tooltip: 'Gestión de Imágenes',
      route: '/admin/icons',
      enable: false,
      group: 'mio'
    },
    {
      id: 5,
      icon_path: '/img/aside-icons/I_G. de planos.png',
      icon_tooltip: 'Gestión de Planos',
      route: '/admin/plans',
      enable: true,
      group: 'mio'
    },
    {
      id: 6,
      icon_path: '/img/aside-icons/icon_icon.png',
      icon_tooltip: 'Gestión de Íconos 2D',
      route: '/admin/map2d-icons',
      enable: true,
      group: 'twin'
    },
    {
      id: 7,
      icon_path: '/img/aside-icons/icon_icon.png',
      icon_tooltip: 'Gestión de Mapas 2D',
      route: '/admin/maps2d',
      enable: true,
      group: 'twin'
    },
    {
      id: 8,
      icon_path: '/img/aside-icons/icon_icon.png',
      icon_tooltip: 'Gestión de Shapes',
      route: '/admin/map2d-shapes',
      enable: false,
      group: 'twin'
    },
    {
      id: 9,
      icon_path: '/img/aside-icons/I_G. de troubleshooting.png',
      icon_tooltip: 'Gestión de Incidencias',
      route: '/admin/troubles',
      enable: false,
      group: 'mio'
    },
    {
      id: 10,
      icon_path: '/img/aside-icons/I_G. de usuarios.png',
      icon_tooltip: 'Gestión de Usuarios',
      route: '/admin/users',
      enable: true,
      group: 'dp'
    },
    {
      id: 11,
      icon_path: '/img/aside-icons/I_G. de autorizaciones.png',
      icon_tooltip: 'Gestión de Autorizaciones',
      route: '/admin/authorizations',
      enable: true,
      group: 'dp'
    },
    {
      id: 12,
      icon_path: '/img/aside-icons/I_G. de despieces.png',
      icon_tooltip: 'Gestión de Despieces',
      route: '/admin/despieces',
      enable: true,
      group: 'mio'
    },
    {
      id: 13,
      icon_path: '/img/aside-icons/icon_icon.png',
      icon_tooltip: 'Gestión de Nodos 360',
      route: '/admin/nodes360-photos',
      enable: true,
      group: 'twin'
    },
    {
      id: 14,
      icon_path: '/img/aside-icons/icon_icon.png',
      icon_tooltip: 'Gestión de Reportes',
      route: '/admin/reports',
      enable: true,
      group: 'twin'
    },
    {
      id: 15,
      icon_path: '/img/aside-icons/icon_icon.png',
      icon_tooltip: 'Gestión de Imágenes',
      route: '/admin/imagenes',
      enable: true,
      group: 'twin'
    },
  ]

  return (
    <div className={`w-full h-full flex flex-col flex-wrap justify-start items-center gap-1 p-2`}>
      <div className='w-full h-[47px] rounded border-b-2'>
        <Button
          // onClick={() => {
          //   setChangeLocation('/admin')
          // }}
          variant={'ghost'}
          className={`w-full h-full p-0 hover:hover:bg-[#556E83] hover:text-white rounded-sm ${changeLocation === '/admin' ? 'bg-[#556E83] text-white' : ''}`}>
          <Link
            className={`w-full h-full flex flex-row justify-start items-center gap-2 p-1`}
            href={'/admin'}>
            <FaHouse size={22} />
            <p className='hidden md:inline'>Inicio</p>
          </Link>
        </Button>
      </div>
      <Label className='font-bold mt-4 text-base'>Digital Portal - Core</Label>
      <Separator />
      {
        moduleList
          .filter((obj: moduleListStructure) => obj.group === 'dp')
          .map((obj: moduleListStructure, i: number) => {
            return (
              <div key={obj.id} className='w-full h-[47px] rounded-sm'>
                <Button
                  onClick={() => {
                    setChangeLocation(obj.route)
                  }}
                  variant={'ghost'}
                  disabled={!obj.enable}
                  className={`w-full h-full p-0 hover:hover:bg-[#556E83] hover:text-white rounded-sm ${obj.enable ? 'cursor-pointer pointer-events-auto' : 'cursor-not-allowed'} ${changeLocation === obj.route ? 'bg-[#556E83] text-white' : ''} `}>
                  <Link
                    href={obj.route}
                    className={`w-full h-full flex flex-row justify-start items-center gap-2 p-1`}>
                    <Image
                      className={`${obj.enable ? 'opacity-100' : 'opacity-50'} `}
                      src={obj.icon_path || "/img/icons/default-icon.png"}
                      height={30}
                      width={30}
                      alt={obj.icon_tooltip + obj.id}
                    />
                    <p className=''>{obj.icon_tooltip}</p>
                  </Link>
                </Button>
              </div>
            )
          })
      }
      <Label className='font-bold mt-4 text-base'>Manual Interactivo de Operación</Label>
      <Separator />
      {
        moduleList
          .filter((obj: moduleListStructure) => obj.group === 'mio')
          .map((obj: moduleListStructure, i: number) => {
            return (
              <div key={obj.id} className='w-full h-[47px] rounded-sm'>
                <Button
                  onClick={() => {
                    setChangeLocation(obj.route)
                  }}
                  variant={'ghost'}
                  disabled={!obj.enable}
                  className={`w-full h-full p-0 hover:hover:bg-[#556E83] hover:text-white rounded-sm ${obj.enable ? 'cursor-pointer pointer-events-auto' : 'cursor-not-allowed'} ${changeLocation === obj.route ? 'bg-[#556E83] text-white' : ''} `}>
                  <Link
                    href={obj.route}
                    className={`w-full h-full flex flex-row justify-start items-center gap-2 p-1`}>
                    <Image
                      className={`${obj.enable ? 'opacity-100' : 'opacity-50'} `}
                      src={obj.icon_path || "/img/icons/default-icon.png"}
                      height={30}
                      width={30}
                      alt={obj.icon_tooltip + obj.id}
                    />
                    <p className=''>{obj.icon_tooltip}</p>
                  </Link>
                </Button>
              </div>
            )
          })
      }

      <Label className='font-bold gap-4 text-base mt-4'>Gemelo Digital</Label>
      <Separator />
      {
        moduleList
          .filter((obj: moduleListStructure) => obj.group === 'twin')
          .map((obj: moduleListStructure, i: number) => {
            return (
              <div key={obj.id} className='w-full h-[47px] rounded-sm'>
                <Button
                  onClick={() => {
                    setChangeLocation(obj.route)
                  }}
                  variant={'ghost'}
                  disabled={!obj.enable}
                  className={`w-full h-full p-0 hover:hover:bg-[#556E83] hover:text-white rounded-sm ${obj.enable ? 'cursor-pointer pointer-events-auto' : 'cursor-not-allowed'} ${changeLocation === obj.route ? 'bg-[#556E83] text-white' : ''} `}>
                  <Link
                    href={obj.route}
                    className={`w-full h-full flex flex-row justify-start items-center gap-2 p-1 `}>
                    <Image
                      className={`${obj.enable ? 'opacity-100' : 'opacity-50'}`}
                      src={obj.icon_path || "/img/menu-icons/gemelo_digital.png"}
                      height={30}
                      width={30}
                      alt={obj.icon_tooltip + obj.id}
                    />
                    <p className=''>{obj.icon_tooltip}</p>
                  </Link>
                </Button>
              </div>
            )
          })
      }

    </div>
  )
}
