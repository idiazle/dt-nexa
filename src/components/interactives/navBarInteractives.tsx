"use client"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { UserInfoMenu } from "../auth/user-info-menu"

const logos = [
  {
    src: "/img/icons/portal-digital.png",
    alt: "nexa-logo",
    width: 45,
    height: 45,
    styles: "rounded-md contain"
  },
  {
    src: "/img/menu-icons/gemelo_digital.png",
    alt: "nexa-logo",
    width: 50,
    height: 50,
    styles: "rounded-md contain"
  },
  {
    src: "/img/nexa_logo.png",
    alt: "nexa-logo",
    width: 100,
    height: 100,
    styles: "bg-white rounded-md contain"
  }
]

const NavBarInteractives = () => {
  const searchParams = useSearchParams()
  const mapType = searchParams.get('map-type')
  const [planeSelected, setPlaneSelected] = useState<string>('2')

  return (
    <div className='absolute z-20 flex flex-row h-[52px] w-full justify-between items-center bg-[#002645] border-b border-gray-300 text-white px-3'>
      <div
        onClick={() => window.location.href = '/menu'}
        className='flex flex-row gap-3 w-1/3 items-center justify-start cursor-pointer'>
        {
          logos.map((logo, index) => (
            <Image
              key={index}
              src={logo.src}
              height={logo.height}
              width={logo.width}
              alt={logo.alt}
              className={logo.styles}
            />
          ))

        }
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
            <SelectItem value="2">Planta Cajamarquilla</SelectItem>
          </SelectContent>
        </Select>
        <UserInfoMenu />
      </div>
    </div>
  )
}

export default NavBarInteractives