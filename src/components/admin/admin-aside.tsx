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


export default function AdminAside() {
    const moduleList: moduleListStructure[] = [
        {
            id: 1,
            icon_path: '/img/aside-icons/I_G. de entidades.png',
            icon_tooltip: 'Gestión de Entidades',
            route: '/entities',
            enable: true
        },
        {
            id: 2,
            icon_path: '/img/aside-icons/I_G. de documentos.png',
            icon_tooltip: 'Gestión de Documentos',
            route: '/entities',
            enable: true
        },
        {
            id: 3,
            icon_path: '/img/aside-icons/I_G. de tags.png',
            icon_tooltip: 'Gestión de Equipos',
            route: '/documents',
            enable: false
        },
        {
            id: 4,
            icon_path: '/img/aside-icons/I_G. de imágenes.png',
            icon_tooltip: 'Gestión de Imágenes',
            route: '/documents',
            enable: false
        },
        {
            id: 5,
            icon_path: '/img/aside-icons/I_G. de planos.png',
            icon_tooltip: 'Gestión de Planos',
            route: '/documents',
            enable: false
        },
        {
            id: 6,
            icon_path: '/img/aside-icons/I_G. de troubleshooting.png',
            icon_tooltip: 'Gestión de Troubleshooting',
            route: '/documents',
            enable: false
        },
        {
            id: 7,
            icon_path: '/img/aside-icons/I_G. de usuarios.png',
            icon_tooltip: 'Gestión de Usuarios',
            route: '/documents',
            enable: false
        },
        {
            id: 8,
            icon_path: '/img/aside-icons/I_G. de autorizaciones.png',
            icon_tooltip: 'Gestión de Autorizaciones',
            route: '/documents',
            enable: false
        },
        {
            id: 9,
            icon_path: '/img/aside-icons/I_G. de despieces.png',
            icon_tooltip: 'Gestión de Despieces',
            route: '/documents',
            enable: false
        },
    ]
    const theme = useTheme()

    return (
        <div className={`w-full h-full flex flex-col flex-wrap justify-start items-center gap-2 pt-5 ${theme.theme === 'dark' ? 'bg-[#030F2E]' : 'bg-[#f3f2f1]'}`}>
            {
                moduleList.map((obj: moduleListStructure, i: number) => {
                    return (
                        <div key={obj.id} className='w-full h-[47px] rounded'>
                            <TooltipProvider>
                                <Tooltip delayDuration={100}>
                                    <TooltipTrigger disabled={!obj.enable} className={`w-full h-full`}>
                                        <Button variant={'ghost'} disabled className={`w-full h-full p-0 ${obj.enable ? 'cursor-pointer' : 'cursor-not-allowed'} ${theme.theme==='dark'?'hover:bg-gray-700':'hover:bg-gray-300'}`} asChild>
                                            <div>
                                                <Image
                                                    className={theme.theme === 'dark' ? 'invert' : 'invert-0'}
                                                    src={obj.icon_path || "/img/icons/default-icon.png"}
                                                    height={30}
                                                    width={30}
                                                    objectFit='contain'
                                                    alt={obj.icon_tooltip + obj.id}
                                                />
                                            </div>
                                        </Button>
                                    </TooltipTrigger>
                                    {
                                        obj.enable ?
                                            <TooltipContent className='ml-1' side='right'>
                                                <p>{obj.icon_tooltip}</p>
                                            </TooltipContent> : null
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
