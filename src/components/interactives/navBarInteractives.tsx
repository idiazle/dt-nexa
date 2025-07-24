"use client"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { UserInfoMenu } from "../auth/user-info-menu"
import AlertsList from "../alerts/alerts-list"
import { Button } from "../ui/button"
import { IoNotifications } from "react-icons/io5"
import { X } from "lucide-react"
import { getAllAlerts } from "@/api/admin/alerts-api"
import { Toast } from "../ui/toast"

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
  const [openListAlerts, setOpenListsAlerts] = useState<boolean>(false)
  const [totalAlerts, setTotalAlerts] = useState<number>(0)
  const prevTotalRef = useRef<number | null>(null)

  useEffect(() => {

    const fetchAlerts = () => {
      getAllAlerts()
        .then(response => {
          if (response.status === 200) {
            const newTotal = response.data.data.filter((alert: any) => alert.status === 0).length

            // Comparar con el valor anterior
            if (prevTotalRef.current !== null && prevTotalRef.current !== newTotal) {
              const difference = newTotal - prevTotalRef.current
              console.log(`Total alerts changed by ${difference} (from ${prevTotalRef.current} to ${newTotal})`)
            }

            prevTotalRef.current = newTotal
            setTotalAlerts(newTotal)
          }
        })
        .catch(error => {
          console.error("Error fetching alerts:", error)
        })
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 5000)
    return () => clearInterval(interval)
  }, [])

  // useEffect(() => {
  //   const fetchAlerts = () => {
  //     getAllAlerts().then(response => {
  //       if (response.status === 200) {
  //         setTotalAlerts(response.data.data.filter((alert: any) => alert.status === 0).length)
  //       }
  //     })
  //       .catch(error => {
  //         console.error("Error fetching alerts:", error);
  //       })
  //   }
  //   fetchAlerts()
  //   // Intervalo de 5 segundos
  //   const interval = setInterval(fetchAlerts, 5000)

  //   // Limpieza del intervalo al desmontar el componente
  //   return () => clearInterval(interval)
  // }, [])

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
        <Button
          title='Alertas'
          size={'icon'}
          className={`rounded-full bg-white hover:bg-[#7196A9] text-[#002645] hover:text-white ${openListAlerts ? 'bg-[#7196A9] text-white' : ''}`}
          onClick={() => { setOpenListsAlerts(!openListAlerts) }}>
          {
            openListAlerts ?
              <X size={20} className='' /> :
              <>
                <IoNotifications size={20} className='' />
                <h1 className='font-bold'>{totalAlerts}</h1>
              </>
          }
        </Button>
        <UserInfoMenu />
      </div>
      {/* <Toast
        title="Información"
        description="Para una mejor experiencia, recomendamos utilizar el navegador Google Chrome."
      // variant="info"
      /> */}
      <AlertsList
        openAlertsView={openListAlerts}
        setOpenAlertsView={setOpenListsAlerts}
      />
    </div>
  )
}

export default NavBarInteractives