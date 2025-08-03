import { getEquipmentById } from '@/api/admin/equipments-api'
import Spinner from '@/components/ui/spinner'
import { type Map2dIconStructure, type EquipmentStructure, type TrouInfoDocDataStructure } from '@/lib/utils'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import { Button } from '@/components/ui/button'
import { getDocumentsByArea } from '@/api/admin/documents-api'
import { getTroubleByEqId } from '@/api/admin/troubles-api'
import { TshootInfDocumButtons } from './trouble-Info-doc-btn'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { getImagenesByEquipment } from '@/api/admin/imagenes-api'

interface InfoEquipCompStructure {
  equipmentIsPressed: boolean
  refToDivOverflow: any
  trouInfodocData: TrouInfoDocDataStructure
  setTrouInfodocData: (value: TrouInfoDocDataStructure) => void
  equipmentSelected: any
  setEquipmentSelected: (value: any) => void
  setStateInformation: (value: any) => void
  setNavIcons: (value: any) => void
  setReportSelected: (value: boolean) => void
  set360ViewSelected: (value: boolean) => void
  setOpenGallery: (value: boolean) => void
  openGallery: boolean
}
export default function InformationEquipmentComponent({ equipmentIsPressed, refToDivOverflow, equipmentSelected, setEquipmentSelected, setStateInformation, setNavIcons, trouInfodocData, setTrouInfodocData, setReportSelected, set360ViewSelected, setOpenGallery, openGallery }: InfoEquipCompStructure) {
  const [equipInformation, setEquipInformation] = useState<EquipmentStructure | null>(null)
  const [troubleshooting, setTroubleshooting] = useState<any[] | null>(null)

  const [overflowValues, setOverflowValues] = useState({
    axisX: 0,
    axisY: 0
  })

  const getInfoEquipment = async () => {
    setEquipInformation(null)
    setTroubleshooting(null)
    try {
      const response = await getEquipmentById(equipmentSelected.obj.entity_id.id as number)
      setEquipInformation(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const refDivEq = useRef(null)
  const [overflowDivTshoot, setOverflowDivTshoot] = useState({
    axisX: 0,
    axisY: 0
  })
  const [buttonMoreINfoPressed, setButtonMoreINfoPressed] = useState(false)

  const [isMovingDiv, setIsMovingDiv] = useState(false)

  const controlOverflowDiv = () => {
    if (refToDivOverflow.current !== null) {
      if (refToDivOverflow.current.scrollHeight > refToDivOverflow.current.clientHeight || refToDivOverflow.current.scrollWidth > refToDivOverflow.current.clientWidth) {
        const axisYValue = refToDivOverflow.current.scrollHeight - refToDivOverflow.current.clientHeight
        const axisXValue = refToDivOverflow.current.scrollWidth - refToDivOverflow.current.clientWidth
        setOverflowValues({ ...overflowValues, axisY: axisYValue + 7, axisX: axisXValue })
        setIsMovingDiv(true)
      } else {
        setIsMovingDiv(false)
        setOverflowValues({ ...overflowValues, axisY: 0, axisX: 0 })
      }
    }
  }
  const moveMoreinfoDiv = () => {
    if (refDivEq.current !== null) {
      let estoyAqui = false
      if (refToDivOverflow.current.scrollWidth > refToDivOverflow.current.clientWidth) {
        // const axisYValue2 = refToDivOverflow.current.scrollHeight - refToDivOverflow.current.clientHeight
        setOverflowDivTshoot({ ...overflowDivTshoot, axisY: 0, axisX: -590 })
        estoyAqui = true
      } else {
        if (!estoyAqui) {
          setOverflowDivTshoot({ ...overflowDivTshoot, axisY: 0, axisX: 320 })
        }
      }
    }
  }
  useEffect(() => {
    controlOverflowDiv()
    moveMoreinfoDiv()
  }, [equipmentSelected])

  useEffect(() => {
    if (!isMovingDiv) {
      moveMoreinfoDiv()
    }
  }, [buttonMoreINfoPressed])

  useEffect(() => {
    if (equipmentSelected !== null) {
      getInfoEquipment()
    }
  }, [equipmentSelected])

  const getTroluble = async () => {
    if (equipmentSelected !== null) {
      try {
        const responseTrouble = await getTroubleByEqId(equipmentSelected.obj.entity_id.id as number)
        setTroubleshooting(responseTrouble.data.data)
      } catch (error) {
        console.log(error)
      }
    }
  }
  useEffect(() => {
    getTroluble()
  }, [equipmentSelected])
  const miRefToScroll = useRef<any>(null)
  useEffect(() => {
    if (miRefToScroll.current !== null) {
      miRefToScroll.current.scrollTop = 0
    }
  }, [equipmentSelected])
  // hola


  const [isThereInfoDoc, setIsThereInfoDoc] = useState<boolean>(false)
  const [dataForInfoDocumental, setDataForInfoDocumental] = useState<null | any>(null)
  const getInfoDocumental = async () => {
    if (equipmentSelected.obj.entity_id !== null) {

      try {
        const response = await getDocumentsByArea(equipmentSelected.obj.entity_id.id as number, '3')
        console.log('MY RESPONSE', response.data.data)
        if (response.status === 200) {
          setDataForInfoDocumental(response.data.data)
        }
      } catch (error) {
        throw new Error('Ocurrió un error al intentar obtener la data')
      }
    }
  }

  useEffect(() => {
    if (equipmentSelected !== null) {
      getInfoDocumental()
    }
  }, [equipmentSelected])

  useEffect(() => {
    if (equipmentSelected !== null) {
      moveMoreinfoDiv()
    }
  }, [overflowValues])

  const initialPositionsDrag = {
    x: 0,
    y: 0
  }

  const posA = useSpring(initialPositionsDrag)

  const bindA = useDrag((params) => {
    posA.x.set(params.offset[0])
    posA.y.set(params.offset[1])
  }, {
    from: ({ args: [originalIndex] }) => [
      posA.x.get(),
      posA.y.get()
    ]
  })

  const [isHave360View, setIsHave360View] = useState<boolean>(false)
  const [isHaveImages, setIsHaveImages] = useState<boolean>(false)

  useEffect(() => {
    getImagenesByEquipment(equipmentSelected.obj.entity_id.id as number)
      .then((response) => {
        if (response.status === 200 && response.data.data.length > 0) {
          setIsHaveImages(true)
        } else {
          setIsHaveImages(false)
        }
      })
      .catch((error) => {
        console.error('Error fetching images:', error)
        setIsHaveImages(false)
      })
  }, [equipmentSelected])

  console.log("equipmentSelected", equipmentSelected)
  console.log("isHaveImages", isHaveImages)

  return (
    <div style={{ left: equipmentSelected?.position?.x - overflowValues.axisX, top: equipmentSelected?.position?.y - overflowValues.axisY }} className={`absolute bg-[#eeeeee] rounded-lg transition-all duration-300 ${equipmentSelected?.isVisible === true ? 'opacity-100 visible' : 'opacity-0 hidden'}`} >
      <animated.div {...bindA()}
        className={'h-full w-full overflow-hidden'}
        style={{
          x: posA.x,
          y: posA.y,
          touchAction: 'none'
        }} >
      <div className='absolute flex flex-row bg-gray-500 bg-opacity-70 gap-0.5 p-2 rounded-md mt-5'>
        <Button
          onClick={() => { setReportSelected(true); set360ViewSelected(false) }}
          className='w-20 h-8 bg-[#002a98] text-white text-xs font-semibold'>
          Reportes
        </Button>
        <Button
          onClick={() => { setReportSelected(false); set360ViewSelected(true) }}
          className='w-20 h-8 bg-[#002a98] text-white text-xs font-semibold'>
          360°
        </Button>
        <Button
          disabled={!isHaveImages}
          onClick={() => { setOpenGallery(true) }}
          className='w-20 h-8 bg-[#002a98] text-white text-xs font-semibold'>
          Imágenes
        </Button>
      </div>

    </animated.div>
    </div >
  )
}
