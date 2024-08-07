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
            icon_path: '',
            icon_tooltip: 'xcsc',
            route: '/entities',
            enable: true
        },
        {
            id: 2,
            icon_path: '/img/icons/default-icon.png',
            icon_tooltip: 'casc',
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
                                        <Button variant={'ghost'} disabled className={`w-full h-full p-0 ${obj.enable ? 'cursor-pointer hover:bg-gray-300 ' : 'cursor-not-allowed'}`} asChild>
                                            <Image
                                                src={obj.icon_path || "/img/icons/default-icon.png"}
                                                height={47}
                                                width={47}
                                                objectFit='contain'
                                                alt={obj.icon_tooltip + obj.id}
                                            />
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
