import { getEquipmentById } from '@/api/admin/equipments-api'
import Spinner from '@/components/ui/spinner'
import { type Map2dIconStructure, type EquipmentStructure, type TrouInfoDocDataStructure } from '@/lib/utils'
import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import { Button } from '@/components/ui/button'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { getDocumentsByArea } from '@/api/admin/documents-api'
import { getTroubleByEqId } from '@/api/admin/troubles-api'
import { TshootInfDocumButtons } from './trouble-Info-doc-btn'

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

  // console.log("KDWOADKOWADWAO", equipmentSelected);


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
        // console.log('ESTOT AUQI')
      } else {
        setIsMovingDiv(false)
        // console.log('ESTOT AUQI2222')
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
  // console.log(posA.x)
  // console.log(posA.y)

  const [isThereInfoDoc, setIsThereInfoDoc] = useState<boolean>(false)
  const [dataForInfoDocumental, setDataForInfoDocumental] = useState<null | any>(null)
  const getInfoDocumental = async () => {
    // console.log('ENTRANDO', equipmentSelected)
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

  // console.log(dataForInfoDocumental?.length)
  // console.log("trouInfodocData", trouInfodocData)

  console.log("EQUIPMENT SELECTEED", equipmentSelected);

  return (

    <div style={{ left: equipmentSelected?.position?.x - overflowValues.axisX, top: equipmentSelected?.position?.y - overflowValues.axisY }} className={`absolute bg-[#eeeeee] rounded-lg transition-all duration-300  h-[450px] ${equipmentSelected?.isVisible === true ? 'opacity-100 visible' : 'opacity-0 hidden'}`} >
      <animated.div {...bindA()}
        className={'h-full w-full'}
        style={{
          x: posA.x,
          y: posA.y,
          touchAction: 'none'
        }} >

        <div className={'absolute '}>
          {/* <div className="flex flex-row justify-between items-center w-full bg-[#002a98] p-1.5 rounded-t">
            <p className="text-white text-xs font-semibold px-2">Información del Equipo</p>
            <MdOutlineClose onClick={() => {
              setEquipmentSelected((prevstate: any) => {
                return {
                  ...prevstate,
                  isVisible: false
                }
              })
              setStateInformation((prevsate: any) => {
                return {
                  ...prevsate,
                  isVisible: false
                }
              })
              setTrouInfodocData({
                ...trouInfodocData,
                visible: false
              })
              if (equipmentSelected === true) {
                setNavIcons((prevstate: Map2dIconStructure[]) => prevstate.map((icon: any) => {
                  if (icon.icon_name === 'Información general de proceso' || icon.icon_name === 'Documentos de proceso') {
                    return {
                      ...icon,
                      is_blocked: false
                    }
                  }
                  return {
                    ...icon,
                    isHover: false,
                    isActive: false
                  }
                }))
              }
              // setNavIcons(prevstate => prevstate.map((icon) => {
              //     if (icon.icon_name == 'Información general de proceso' || icon.icon_name == 'Documentos de proceso' || icon.icon_name == 'Interactivos PFD' || icon.icon_name == 'Interactivos de control') {
              //         if (icon.is_blocked == true) {
              //             return {
              //                 ...icon,
              //                 is_blocked: false
              //             }
              //         }
              //     }
              //     return {
              //         ...icon,
              //         isHover: false,
              //         isActive: false,
              //     }
              // }))
            }} color={'white'} className="mr-1 hover:cursor-pointer" />
          </div> */}
          <div className='flex flex-col justify-center items-center bg-gray-500 bg-opacity-70 gap-0.5 p-2 rounded-sm'>
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
              onClick={() => { setOpenGallery(true) }}
              className='w-20 h-8 bg-[#002a98] text-white text-xs font-semibold'>
              Imágenes
            </Button>
          </div>
          {/* {
            equipInformation != null
              ? <div className='bg-[#f1f1f1] flex flex-col h-full w-full border border-[#c2c2c2]  rounded-b'>
                <div ref={miRefToScroll} className="flex w-full h-full flex-col p-2 overflow-auto bg-[#f1f1f1] border-b border-[#c2c2c2]">
                  <div>
                    <h1 className='border-b-2 border-gray-800 font-semibold text-black'>TAG</h1>
                    <p className='p-1 text-xs text-black'>{equipInformation?.tag}</p>
                  </div>
                  <div>
                    <h1 className='border-b-2 border-gray-800 font-semibold text-black'>Proceso Asociado</h1>
                    <p className='p-1 text-xs text-black'>{equipInformation?.parent_data?.name}</p>
                  </div>
                  <div>
                    <h1 className='border-b-2 border-gray-800 font-semibold text-black'>Nombre</h1>
                    <p className='p-1 text-xs text-black'>{equipInformation?.name}</p>
                  </div>
                  <div>
                    <h1 className='border-b-2 border-gray-800 font-semibold text-black'>Características</h1>
                    <div className='p-1 text-xs text-black'>
                      {
                        JSON.parse(equipInformation?.properties ?? '').filter((filt: any) => filt.value !== '').map((property: any, index: number) => {
                          return (
                            <div key={index} className='flex flex-row justify-start items-center gap-2 w-full'>
                              <div className='w-1/2'>
                                <p className='text-xs text-left text-black'>{property.label} </p>
                              </div>
                              <div className='w-1/2'>
                                <p className='text-xs text-left text-black'>: {property.value}</p>
                              </div>
                            </div>
                          )
                        })
                      }

                    </div>
                  </div>
                  <div>
                    <h1 className='border-b-2 border-gray-800 font-semibold text-black'>Descripción</h1>
                    <p className='p-1 text-xs text-black'>{((equipInformation?.level_data?.description) != null) ? equipInformation?.level_data?.description : 'No posee descripción'}</p>
                  </div>
                </div>
                <div className='flex flex-row gap-3 justify-center items-end my-3 mx-3 bg-[#f1f1f1]'>
                  <Button disabled={!((troubleshooting != null) && troubleshooting?.length > 0)} size={'sm'} className='transition-all h-7 duration-300 border rounded border-[#bababa] w-1/2 text-xs bg-[#ffffff] hover:bg-slate-200 font-semibold text-black' onClick={() => {
                    getTroluble()
                    setTrouInfodocData({
                      ...trouInfodocData,
                      operation_type: 1,
                      equipment_id: equipmentSelected?.obj?.entity_id.id,
                      visible: true
                    })
                  }}>
                    Troubleshooting
                  </Button>
                  <Button disabled={!(dataForInfoDocumental?.length > 0)} size={'sm'} className='transition-all h-7 duration-300 border rounded w-1/2 py-1 text-xs border-[#bababa] bg-[#ffffff] hover:bg-slate-200 font-semibold text-black' onClick={() => {
                    setTrouInfodocData({
                      ...trouInfodocData,
                      operation_type: 2,
                      equipment_id: equipmentSelected?.obj?.entity_id.id,
                      visible: true
                    })
                    setButtonMoreINfoPressed(!buttonMoreINfoPressed)
                  }}>
                    Información Documental
                  </Button>
                </div>
              </div>
              : <div className='flex justify-center items-center w-full h-full'>
                <Spinner />
              </div>
          } */}
        </div>

        <div ref={refDivEq} style={{ left: overflowDivTshoot.axisX, top: overflowDivTshoot.axisY }}
          className={`absolute transition-all duration-300 ml-5 ${trouInfodocData.operation_type === 1 ? 'h-[550px] w-[700px]' : 'h-full w-[550px]'} rounded-lg bg-[#f1f1f1] ${trouInfodocData.visible ? 'opacity-100 visible' : 'opacity-0 hidden'}`}>
          <div className='flex flex-row justify-between items-center p-1.5 bg-[#002a98] rounded-t'>
            <p className="text-white text-xs font-semibold px-2">{trouInfodocData.operation_type === 1 ? 'Troubleshooting' : 'Información documental'}</p>
            <MdOutlineClose color={'white'} className="mr-1 hover:cursor-pointer" onClick={() => {
              setTrouInfodocData({
                ...trouInfodocData,
                visible: false
              })
            }} />
          </div>
          <TshootInfDocumButtons setIsThereInfoDoc={setIsThereInfoDoc} data={trouInfodocData} setData={setTrouInfodocData} trouble={troubleshooting} triggerButton={buttonMoreINfoPressed} />
          {/* <EquipmentButtonsInfo data={trouInfodocData} setData={setTrouInfodocData} trouble={troubleshooting} triggerButton={buttonMoreINfoPressed} /> */}

        </div>
      </animated.div>

    </div>
  )
}
