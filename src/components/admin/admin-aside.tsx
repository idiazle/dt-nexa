'use client'
import React, { useMemo } from 'react'
import { moduleListStructure } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from '../ui/button'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { FaHouse } from "react-icons/fa6";
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'

export default function AdminAside() {
  const theme = useTheme()
  const location = window.location.pathname
  console.log('Current location:', location)

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
      icon_path: '/img/aside-icons/I_G. de imágenes.png',
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
      icon_path: '',
      icon_tooltip: 'Gestión de Mapas 2D',
      route: '/admin/maps2d',
      enable: true,
      group: 'twin'
    },
    {
      id: 8,
      icon_path: '',
      icon_tooltip: 'Gestión de Shapes',
      route: '/admin/map2d-shapes',
      enable: false,
      group: 'twin'
    },
    {
      id: 9,
      icon_path: '/img/aside-icons/I_G. de troubleshooting.png',
      icon_tooltip: 'Gestión de Troubleshooting',
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
      icon_path: '',
      icon_tooltip: 'Gestión de Nodos 360',
      route: '/admin/nodes360-photos',
      enable: true,
      group: 'twin'
    },
    {
      id: 14,
      icon_path: '',
      icon_tooltip: 'Gestión de Reportes',
      route: '/admin/reports',
      enable: true,
      group: 'twin'
    },
  ]

  return (
    <div className={`w-full h-full flex flex-col flex-wrap justify-start items-center gap-1 p-2`}>
      <div className='w-full h-[47px] rounded border-b-2'>
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger className={`w-full h-full`}>
              <Button variant={'ghost'} className={`w-full h-full p-0`} asChild>
                <Link href={'/admin'}>
                  <FaHouse size={22} />
                </Link>
              </Button>
            </TooltipTrigger>
            {/* <TooltipContent className='ml-1' side='right'>
              <p>Listado de módulos</p>
            </TooltipContent> */}
          </Tooltip>
        </TooltipProvider>
      </div>
      <Label className='font-bold mt-4 text-base'>Digital Portal - Core</Label>
        <Separator />
        {
          moduleList
            .filter((obj: moduleListStructure) => obj.group === 'dp')
            .map((obj: moduleListStructure, i: number) => {
              return (
                <div key={obj.id} className='w-full h-[47px] rounded-sm'>
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger
                        disabled={!obj.enable}
                        className={`w-full h-full`}>
                        <Button
                          variant={'ghost'}
                          disabled={!obj.enable}
                          className={`w-full h-full p-0 ${obj.enable ? 'cursor-pointer pointer-events-auto' : 'cursor-not-allowed'} `}>
                          <Link
                            href={obj.route}
                            className={`w-full h-full flex flex-row justify-start items-center gap-2 p-1 hover:hover:bg-[#002645] hover:text-white rounded-sm`}>
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
                      </TooltipTrigger>
                      {/* <TooltipContent className='ml-1' side='right'>
                    <p>{obj.enable ? obj.icon_tooltip : 'No disponible'}</p>
                  </TooltipContent> */}
                    </Tooltip>
                  </TooltipProvider>
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
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger
                        disabled={!obj.enable}
                        className={`w-full h-full`}>
                        <Button
                          variant={'ghost'}
                          disabled={!obj.enable}
                          className={`w-full h-full p-0 ${obj.enable ? 'cursor-pointer pointer-events-auto' : 'cursor-not-allowed'} `}>
                          <Link
                            href={obj.route}
                            className={`w-full h-full flex flex-row justify-start items-center gap-2 p-1 hover:hover:bg-[#002645] hover:text-white rounded-sm`}>
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
                      </TooltipTrigger>
                      {/* <TooltipContent className='ml-1' side='right'>
                    <p>{obj.enable ? obj.icon_tooltip : 'No disponible'}</p>
                  </TooltipContent> */}
                    </Tooltip>
                  </TooltipProvider>
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
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger
                      disabled={!obj.enable}
                      className={`w-full h-full`}>
                      <Button
                        variant={'ghost'}
                        disabled={!obj.enable}
                        className={`w-full h-full p-0 ${obj.enable ? 'cursor-pointer pointer-events-auto' : 'cursor-not-allowed'} `}>
                        <Link
                          href={obj.route}
                          className={`w-full h-full flex flex-row justify-start items-center gap-2 p-1 hover:hover:bg-[#002645] hover:text-white rounded-sm`}>
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
                    </TooltipTrigger>
                    {/* <TooltipContent className='ml-1' side='right'>
                    <p>{obj.enable ? obj.icon_tooltip : 'No disponible'}</p>
                  </TooltipContent> */}
                  </Tooltip>
                </TooltipProvider>
              </div>
            )
          })
      }

    </div>
  )
}
