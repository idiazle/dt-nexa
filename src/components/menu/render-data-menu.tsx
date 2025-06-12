'use client'
import { UserInfoMenu } from '@/components/auth/user-info-menu'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ModulesMenu from '@/components/menu/modules-menu'
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { EntityStructure, MenuIconsStructure } from '@/lib/utils'

interface RenderDataMenuStructure {
  data: MenuIconsStructure[]
  dataPlants: EntityStructure[]
}
export default function RenderDataMenu({ data, dataPlants }: RenderDataMenuStructure) {
  const [selectedPlant, setSelectedPlant] = useState<any>('')
  console.log("SELECTED PLANT", selectedPlant);

  return (
    <div className='h-full w-full flex flex-col justify-between items-stretch'>
      <div>
        <div className='flex justify-end p-2'>
          <UserInfoMenu />
        </div>
        {/* IMAGEN CENTRAL */}
        <div className='flex flex-col justify-center items-center mt-10 gap-4'>
          <Image
            src="/img/icons/portal-digital.png"
            width={100}
            height={100}
            alt="Picture of the author"
            className='contain'
          />
          <p className='text-3xl font-bold'>Digital Portal</p>
          <Image
            src="/img/nexa_logo.png"
            width={250}
            height={250}
            alt="Picture of the author"
            className='contain bg-white p-0.5 rounded-lg'
          />
          <div className='flex flex-col justify-center items-center w-full pt-10 gap-3'>
            <h1 className='font-bold text-2xl'>MÓDULOS</h1>
            <Select value='5' onValueChange={(val) => { setSelectedPlant(val) }}>
              <SelectTrigger className="w-1/3 h-8 bg-transparent border-white">
                <SelectValue placeholder="Seleccione planta" />
              </SelectTrigger>
              <SelectContent>
                {
                  dataPlants.map((obj) => {
                    return (
                      <SelectItem key={obj.id} value={String(obj.id)}>{obj.name}</SelectItem>
                    )
                  })
                }
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Zona de Módulos */}
      <div className='flex justify-center items-center mb-16'>

        <ModulesMenu data={data} selectedPlant={dataPlants.find((obj) => obj.id === Number(selectedPlant))} />
        {/* <div className='absolute right-10'>
          <Menubar className="flex flex-row flex-wrap-reverse bg-transparent border-none gap-5">
            <MenubarMenu>
              <div className="flex flex-col items-center max-w-24 min-h-[160px] gap-2">
                <MenubarTrigger className="flex flex-col items-center gap-2 p-0 rounded-2xl focus:bg-white/35 data-[state=open]:bg-white/60">
                  <div className="border border-white/50 p-4 rounded-2xl">
                    <div className="relative h-[67px] w-[67px] overflow-hidden">
                      <Image
                        src={'/img/menu-icons/manual-usuario.png'}
                        alt={'manual-usuario'}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                </MenubarTrigger>
                <p className="text-center text-xs leading-tight h-[32px] overflow-hidden text-ellipsis">
                  Manual de Usuario
                </p>
              </div>
              <MenubarContent side="top" className="bg-[#385b6d]">
                <MenubarItem >
                  <div className="border-b border-white w-full p-1">
                    Opción 1
                  </div>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div> */}
      </div>
    </div>
  )
}
