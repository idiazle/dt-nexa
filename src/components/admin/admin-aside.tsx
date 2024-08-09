'use client'
import React from 'react'
import { ChangeTheme } from '../change-theme'
import { moduleListStructure } from '@/lib/utils'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from '../ui/button'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { FaHouse } from "react-icons/fa6";


export default function AdminAside() {
    const moduleList: moduleListStructure[] = [
        {
            id: 1,
            icon_path: '/img/aside-icons/I_G. de entidades.png',
            icon_tooltip: 'Gestión de Entidades',
            route: '/admin/entities',
            enable: true
        },
        {
            id: 2,
            icon_path: '/img/aside-icons/I_G. de documentos.png',
            icon_tooltip: 'Gestión de Documentos',
            route: '/admin/documents',
            enable: true
        },
        {
            id: 3,
            icon_path: '/img/aside-icons/I_G. de tags.png',
            icon_tooltip: 'Gestión de Equipos',
            route: '/admin/equipments',
            enable: false
        },
        {
            id: 4,
            icon_path: '/img/aside-icons/I_G. de imágenes.png',
            icon_tooltip: 'Gestión de Imágenes',
            route: '/admin/icons',
            enable: false
        },
        {
            id: 5,
            icon_path: '/img/aside-icons/I_G. de planos.png',
            icon_tooltip: 'Gestión de Planos',
            route: '/admin/plans',
            enable: false
        },
        {
            id: 6,
            icon_path: '/img/aside-icons/I_G. de troubleshooting.png',
            icon_tooltip: 'Gestión de Troubleshooting',
            route: '/admin/troubles',
            enable: false
        },
        {
            id: 7,
            icon_path: '/img/aside-icons/I_G. de usuarios.png',
            icon_tooltip: 'Gestión de Usuarios',
            route: '/admin/users',
            enable: false
        },
        {
            id: 8,
            icon_path: '/img/aside-icons/I_G. de autorizaciones.png',
            icon_tooltip: 'Gestión de Autorizaciones',
            route: '/admin/authorizations',
            enable: false
        },
        {
            id: 9,
            icon_path: '/img/aside-icons/I_G. de despieces.png',
            icon_tooltip: 'Gestión de Despieces',
            route: '/admin/despieces',
            enable: false
        },
    ]
    const theme = useTheme()
    const colorNav = 'bg-gradient-to-r from-[#aa945e] to-[#030F2E]'


    return (
        <div className={`w-full h-full flex flex-col flex-wrap justify-start items-center gap-2 pt-5 ${theme.theme === 'dark' ? 'bg-[#030F2E]' : 'bg-[#f3f2f1]'}`}>
            <div className='w-full h-[47px] rounded border-b-2'>
                <TooltipProvider>
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger className={`w-full h-full`}>
                            <Button variant={'ghost'} className={`w-full h-full p-0 ${theme.theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`} asChild>
                                <Link href={'/admin'}>
                                    <FaHouse size={22} />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        {
                            <TooltipContent className='ml-1' side='right'>
                                <p>Listado de módulos</p>
                            </TooltipContent>
                        }
                    </Tooltip>
                </TooltipProvider>
            </div>

            {
                moduleList.map((obj: moduleListStructure, i: number) => {
                    return (
                        <div key={obj.id} className='w-full h-[47px] rounded'>
                            <TooltipProvider>
                                <Tooltip delayDuration={100}>
                                    <TooltipTrigger disabled={!obj.enable} className={`w-full h-full`}>
                                        <Button variant={'ghost'} disabled={!obj.enable} className={`w-full h-full p-0 ${obj.enable ? 'cursor-pointer pointer-events-auto' : 'cursor-not-allowed'} ${theme.theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`} asChild>
                                            <Link href={obj.route}>
                                                <Image
                                                    className={`${theme.theme === 'dark' ? 'invert' : 'invert-0'} ${obj.enable ? 'opacity-100' : 'opacity-50'}`}
                                                    src={obj.icon_path || "/img/icons/default-icon.png"}
                                                    height={30}
                                                    width={30}
                                                    alt={obj.icon_tooltip + obj.id}
                                                />
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    {

                                        <TooltipContent className='ml-1' side='right'>
                                            <p>{obj.enable ? obj.icon_tooltip : 'No disponible'}</p>
                                        </TooltipContent>
                                    }
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    )
                })
            }
        </div>
    )
}
