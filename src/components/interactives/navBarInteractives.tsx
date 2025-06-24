"use client"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { UserInfoMenu } from "../auth/user-info-menu"

const NavBarInteractives = () => {
  const searchParams = useSearchParams()
  const mapType = searchParams.get('map-type')
  const [planeSelected, setPlaneSelected] = useState<string>('2')


  return (
    <div className='absolute z-20 flex flex-row h-[52px] w-full justify-between items-center bg-[#002645] border-b border-gray-300 text-white px-3'>
      <div
        onClick={() => window.location.href = '/menu'}
        className='flex flex-row gap-3 w-1/3 items-center justify-start cursor-pointer'>
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
        <h1 className='text-xl font-bold'>{mapType === '1' ? 'DIAGRAMA DE FLUJO DE CONFIABILIDAD' : mapType === '3' ? 'DIAGRAMA DE NAVEGACIÓN DE PLANTA' : 'GEMELO DIGITAL DE CONFIABILIDAD'}</h1>
      </div>
      <div className='flex flex-row gap-7 items-center w-1/3 justify-end'>
        <Select value={planeSelected} onValueChange={(val) => { setPlaneSelected(val) }}>
          <SelectTrigger className="w-52 bg-transparent border-white bg-white text-black">
            <SelectValue placeholder="Seleccionar Planta" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value="1">S20-01</SelectItem> */}
            <SelectItem value="2">Planta Cajamarquilla</SelectItem>
            {/* <SelectItem value="3">S20-03</SelectItem> */}
          </SelectContent>
        </Select>
        <UserInfoMenu />
      </div>
    </div>
  )
}

export default NavBarInteractives