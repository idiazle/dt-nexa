"use client"
import React, { useRef, useState } from 'react'
import { MapContainer, ImageOverlay, FeatureGroup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from 'leaflet';
import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { DocumentStructure, EntityStructure, EquipmentStructure, Map2dShapesStructure, Map2dStructure, PlanStructure, ShapeStructure, StateInformationStructure, TrouInfoDocDataStructure } from '@/lib/utils';
import { bounds, centerLat, centerLng, maxBounds } from './static-data';
import { useSession } from 'next-auth/react';
import { EditControl } from "react-leaflet-draw"
import { Button } from '../ui/button';
import { TbTriangleSquareCircleFilled } from "react-icons/tb";
import { FaAngleDown, FaAngleUp, FaBars, FaCircleXmark, FaFile, FaSquarePlus, FaTrash } from "react-icons/fa6";
import ShapesPlanDialog from '../admin/plans/shapes-plan-dialog';
import { EyeClosedIcon } from '@radix-ui/react-icons';
import { EyeIcon } from 'lucide-react';
import ViewShapes from './view-shapes';
import Spinner from '../ui/spinner';
import { FaWindowClose } from "react-icons/fa";
import ModalViewMedia from '../viewers/modal-viewer';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { deleteShapeById, putShapeById } from '@/api/shapes-api'
import { toast } from '../ui/use-toast'
import AlertDeleteDialog from '../general/alert-delete-dialog';
import InformationEquipmentComponent from '../interactives/information-eq';
import Link from 'next/link';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';


interface MapProps {
  mapSelected: Map2dStructure | null
  posix: LatLngExpression | LatLngTuple,
  zoom?: number,
}

const defaults = {
  zoom: 19,
}

interface MenuBtns {
  id: number
  show_name: string
  hide_name: string
  icon: any
  active: boolean
}




export default function PlansMapContainer(Map: MapProps) {

  // const { zoom = defaults.zoom, posix } = Map
  const [flagRefresh, setFlagRefresh] = useState<boolean>(false)
  const [shapesRender, setShapesRender] = useState<ShapeStructure[] | null>([])
  const [selectedShape, setSelectedShape] = useState<ShapeStructure | null>(null)
  const [alertDeleteShape, setAlertDeleteShape] = useState<boolean>(false)
  const { data: session } = useSession()

  const [openShapeDialog, setopenShapeDialog] = useState<boolean>(false)

  const [planShape, setPlanShape] = useState<ShapeStructure | null>(null)

  const admin = session?.user?.groups.find((obj: any) => obj === 1 || obj === 3)
  const refFeature = useRef<any>()

  const _onCreate = (e: any) => {
    // console.log("ON CREATEEE222", e.layer._latlngs);

    if (e.layer._latlngs || e.layer._latlng) {
      let objShape = {
        type: String(e.layerType),
        coordinates: e.layer._latlng || e.layer._latlngs
      } as any


      if (e.layerType === 'circle') {
        objShape = {
          ...objShape,
          radius: e.layer._mRadius
        }
      }

      if (objShape) {
        setPlanShape({
          ...planShape as ShapeStructure,
          shapes: objShape as any,
          plan_id: Number(Map.mapSelected?.id)
        })
      }
      setopenShapeDialog(true)
      // setSendShapes({ ...sendShapes, shapes: objShape })
      // addShapeModalDisc.onOpen()
      // setOpenAddShape(true)
    }
  }


  const _onEditPath = async (e: any) => {
    // console.log("on EDIT PATH", e);
    // console.log("on EDIT LayerType", e.layers._layers );
    const shapeType = selectedShape?.shapes.type
    const dataShape = Object.values(e.layers._layers)[0] as any

    if (dataShape._latlngs || dataShape._latlng) {
      let objShape = {
        type: shapeType,
        coordinates: dataShape._latlng || dataShape._latlngs,
        color: selectedShape?.shapes.color
      } as any


      if (shapeType === 'circle') {
        objShape = {
          ...objShape,
          radius: dataShape._mRadius
        }
      }

      // if (objShape) {
      //     console.log("FINAL SHAPE", objShape)
      // }
      // setopenShapeDialog(true)
      // setSendShapes({ ...sendShapes, shapes: objShape })
      // addShapeModalDisc.onOpen()
      // setOpenAddShape(true)

      const sendDataShape = {
        shapes: JSON.stringify(objShape),
        shape_type: selectedShape?.shape_type
      }

      if (selectedShape !== null) {
        try {
          const response = await putShapeById(Number(selectedShape.id), sendDataShape)
          if (response.status === 200) {
            toast({
              duration: 3000,
              variant: 'default',
              title: 'Edición',
              description: 'Shape editado correctamente'
            })
            setCloseInformation(true)
            setSelectedShape(null)
            location.reload();
            setFlagRefresh(!flagRefresh)
          }
        } catch (error) {
          toast({
            duration: 3000,
            variant: 'destructive',
            title: 'Error',
            description: 'Ocurrió un error al editar el shape'
          })
          throw new Error("ERROR AL PUT")
        }
      }


    }

  }

  const onDelete = async () => {
    try {
      if (selectedShape !== null) {
        const response = await deleteShapeById(Number(selectedShape.id))
        if (response.status === 200) {
          toast({
            duration: 3000,
            variant: 'default',
            title: 'Eliminación',
            description: 'Shape eliminado correctamente'
          })
          setFlagRefresh(!flagRefresh)
        }
      }

    } catch (error) {
      toast({
        duration: 3000,
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error al eliminar el shape'
      })
      throw new Error("ERROR AL Eliminar")
    }
  }

  const initialStateMenuBtns: MenuBtns[] = [
    // {
    //     id: 1,
    //     show_name: 'Mostrar formas',
    //     hide_name: 'Ocultar formas',
    //     icon: <TbTriangleSquareCircleFilled size={25} />,
    //     active: true
    // },
    {
      id: 2,
      show_name: 'Mostrar edición',
      hide_name: 'Ocultar edición',
      icon: <TbTriangleSquareCircleFilled size={25} />,
      active: true
    },
  ]

  const [actionMenuBtns, setActionMenuBtns] = useState<MenuBtns[]>(initialStateMenuBtns)

  const [controlMinimized, setControlMinimized] = useState<boolean>(false)

  const handleClickBtn = (obj: any) => {

    setActionMenuBtns((prevstate) => prevstate.map((obj2) => {
      if (obj2.id === obj.id) {
        return {
          ...obj2,
          active: !obj2.active
        }
      } else {
        return obj2
      }
    }))

  }


  const mapRef = useRef(null)

  const [renderLeftInformation, setRenderLeftInformation] = useState<{
    entity_data: EntityStructure | EquipmentStructure
    documents: DocumentStructure[]
  } | null>(null)

  const [closeInformation, setCloseInformation] = useState<boolean>(false)


  const [openViewMedia, setOpenViewMedia] = useState<boolean>(false)

  const [openMediaInfo, setOpenMediaInfo] = useState<{
    data: {
      file_url: string
      title: string
    },
    type: string
  }>({
    data: {
      file_url: '',
      title: ''
    },
    type: ''
  })


  const entityType = selectedShape?.entity_type

  const onSetViewDoc = (document: DocumentStructure) => {

    setOpenViewMedia(true)
    if (document.file_url.includes('pdf')) {
      setOpenMediaInfo((prev: any) => {
        return {
          ...prev,
          type: 'document',
          data: {
            file_url: document.file_url,
            type: '',
            title: document.title
          }
        }
      })
    } else if (document.file_url.includes('mp4') || document.file_url.includes('mkv')) {
      setOpenMediaInfo((prev: any) => {
        return {
          ...prev,
          type: 'video',
          data: {
            file_url: document.file_url,
            type: '',
            title: document.title
          }
        }
      })
    }
  }




  const renderLefInfo = (type: number) => {

    if (selectedShape !== null && renderLeftInformation !== null) {
      const equipmentInfo = renderLeftInformation?.entity_data as EquipmentStructure
      const entityInfo = renderLeftInformation?.entity_data as EntityStructure
      switch (type) {
        case 3:
          return (
            <div className='mt-5 gap-5 rounded h-full w-full flex flex-col overflow-hidden'>
              <div className='w-full border-b bg-[#030F2E] rounded'>
                <h1 className='text-right text-white mx-2'>{equipmentInfo.tag + "-" + renderLeftInformation?.entity_data.name}</h1>
              </div>
              <div>
                <div className='w-full border-b bg-[#030F2E] rounded'>
                  <h1 className='text-right text-white mx-2'>Propiedades del Equipo</h1>
                </div>

                {
                  JSON.parse(equipmentInfo?.properties as any)?.filter((obj2: any) => obj2.value !== '')?.map((obj: any, index: number) => {
                    return (
                      <div className='flex flex-row justify-between items-center' key={index}>
                        <p>{obj.label}</p>
                        <p>{obj.value}</p>
                      </div>
                    )
                  }) ?? null
                }
              </div>
              <div className='w-full h-full overflow-hidden flex flex-col'>
                <div className='w-full border-b bg-[#030F2E] rounded'>
                  <h1 className='text-right text-white mx-2'>Documentos del Equipo</h1>
                </div>
                <div className='h-full w-full overflow-auto'>
                  {
                    renderLeftInformation.documents.map((obj: any) => {
                      const document = obj.document_id as DocumentStructure

                      return (

                        <button title={document.file_url === null ? 'Sin archivo' : ''} disabled={document.file_url === null} key={obj.id} className={`rounded w-full transition-all duration-300 gap-1 p-1 flex flex-row justify-start items-center ${document.file_url === null ? '' : 'hover:bg-slate-300'}`}
                          onClick={() => {
                            onSetViewDoc(document)
                          }}>
                          <FaFile size={15} color={`${document.file_url === null ? 'gray' : 'black'}`} />
                          <p key={obj.id} className={`text-xs ml-3 text-left font-semibold ${document.file_url === null ? 'text-gray-500' : 'text-black'}`}>{document?.title}</p>
                        </button>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          )
        default:
          return (
            <div className='h-full w-full mt-5'>
              <div className='w-full border-b'>
                <h1 className='text-right'>{renderLeftInformation?.entity_data.name}</h1>
              </div>
            </div>
          )
      }
    }
  }



  const refDivOverflow = useRef(null)

  const [equipmentPressed, setEquipmentPressed] = useState(false)
  const [equipmentSelected, setEquipmentSelected] = useState<any>(null)
  const [stateInformation, setStateInformation] = useState<StateInformationStructure | null>(null)
  const [trouInfodocData, setTrouInfodocData] = useState<TrouInfoDocDataStructure>({
    operation_type: null,
    visible: false,
    equipment_id: null,
  })

  const [isOpen, setIsOpen] = useState<boolean>(true)
  const [planeSelected, setPlaneSelected] = useState<string>('2')

  return (
    <div className='flex flex-col w-full h-full relative' ref={refDivOverflow}>
      <div className='relative w-full h-full'>
        <div className='flex flex-row h-[52px] w-full justify-between items-center bg-[#022799] border-b border-gray-300 text-white px-3'>
          <div className='flex flex-row gap-3 w-1/3 items-center justify-start'>
            <Image
              src="/img/nexa_logo.png"
              height={100}
              width={100}
              objectFit='contain'
              alt={"nexa-logo"}
              className='bg-white rounded-md'
            />
            {/* <h1 className='font-semibold'>Cajamarquilla</h1> */}
          </div>
          <div className='flex flex-col justify-center items-center w-1/3'>
            <h1 className='text-xl font-bold'>DIAGRAMA DE FLUJO DE PROCESOS</h1>
          </div>
          <div className='flex flex-row gap-5 items-center w-1/3 justify-end'>
            <Select value={planeSelected} onValueChange={(val) => { setPlaneSelected(val) }}>
              <SelectTrigger className="w-40 h-8 bg-transparent border-white bg-white text-black">
                <SelectValue placeholder="Seleccionar Planta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">S20-01</SelectItem>
                <SelectItem value="2">S20-02</SelectItem>
                <SelectItem value="3">S20-03</SelectItem>
              </SelectContent>
            </Select>
            <div className='bg-white text-black p-2 rounded-md flex flex-row items-center'>
              <FaBars />
            </div>
          </div>
        </div>
        <MapContainer
          ref={mapRef}
          crs={L.CRS.Simple}
          center={[centerLat, centerLng]} // Centra la imagen en el inicio
          zoom={0} // Establece el nivel de zoom inicial
          minZoom={0} // Establece el nivel mínimo de zoom
          zoomDelta={0.25}
          zoomSnap={0.25}
          zoomControl={false}
          wheelPxPerZoomLevel={240}
          bounds={bounds}
          style={{
            height: '100%',
            width: '100%',
            background: 'white'
          }}
          className='z-0'
          maxBounds={maxBounds} // Limita el panning al área de la imagen
          attributionControl={false}

        >
          <ImageOverlay
            bounds={bounds}
            zIndex={1}
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={String(Map.mapSelected?.file)}
          />

          {
            admin !== undefined ?
              <FeatureGroup ref={refFeature}>
                <>
                  {
                    selectedShape !== null ?
                      <EditControl
                        edit={{
                          edit: true,
                          remove: false
                        }}

                        position='bottomright'
                        onCreated={_onCreate}
                        onEdited={_onEditPath}
                        draw={{
                          polyline: false,
                          polygon: false,
                          circle: false,
                          circlemarker: false,
                          rectangle: false,
                          marker: false
                        }}
                      /> : null


                  }
                  {
                    closeInformation || selectedShape === null ? <EditControl
                      edit={{
                        edit: false,
                        remove: false
                      }}


                      position='bottomright'
                      onCreated={_onCreate}
                      onEdited={_onEditPath}
                      draw={{
                        polyline: false,
                        polygon: true,
                        circle: true,
                        circlemarker: false,
                        rectangle: true,
                        marker: false
                      }}
                    /> : null
                  }
                </>
                <ViewShapes
                  refDivOverflow={refDivOverflow}
                  flagRefresh={flagRefresh}
                  showShapes={actionMenuBtns[0].active}
                  setRenderLeftInformation={setRenderLeftInformation}
                  setCloseInformation={setCloseInformation}
                  setSelectedShape={setSelectedShape}
                  shapesRender={shapesRender}
                  setShapesRender={setShapesRender}
                  setEquipmentPressed={setEquipmentPressed}
                  setEquipmentSelected={setEquipmentSelected}
                />
                : null

              </FeatureGroup> : null
          }
        </MapContainer>
      </div>
      {
        equipmentPressed ?
          <InformationEquipmentComponent
            equipmentIsPressed={equipmentPressed}
            setEquipmentSelected={setEquipmentSelected}
            equipmentSelected={equipmentSelected}
            refToDivOverflow={refDivOverflow}
            setNavIcons={() => { }}
            setStateInformation={setStateInformation}
            setTrouInfodocData={setTrouInfodocData}
            trouInfodocData={trouInfodocData}
          /> : null
      }

      {/* TOP MENU CONTROL */}
      <div className={`absolute transition-all duration-500 m-auto left-2 bottom-10 flex justify-center items-center ${!controlMinimized ? 'opacity-100' : 'opacity-0'} w-7 h-7`}>
        <div className='flex justify-center items-center w-full h-full bg-[#ffffff] text-white transition-all duration-300'>
          {/* <FaSquareMinus size={20} className='absolute right-0 top-0 hover:cursor-pointer' onClick={() => { setControlMinimized(true) }} /> */}
          {
            actionMenuBtns.map((obj) => {
              return (
                <TooltipProvider delayDuration={300} key={obj.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button key={obj.id} className='rounded-sm h-full w-full bg-[#ffffff] border-[#cccccc] hover:bg-[#eeeeee]' size={'icon'} variant={'outline'} onClick={() => handleClickBtn(obj)}>
                        {/* <div className='flex flex-col justify-center items-center'>
                                                    <div className='flex flex-row justify-center items-center gap-3'> */}
                        {/* {obj.icon} */}
                        {obj.active ? <EyeIcon size={20} color='#464646' /> : <EyeClosedIcon fontSize={20} color='#464646' />}
                        {/* </div> */}
                        {/* <EyeIcon/> */}
                        {/* <p className='text-xs'>{!obj.active ? obj.show_name : obj.hide_name}</p> */}
                        {/* </div> */}
                      </Button>

                    </TooltipTrigger>
                    <TooltipContent side='right'>
                      <p>{!obj.active ? obj.show_name : obj.hide_name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

              )
            })
          }

        </div>
      </div>

      {/* BOTTOM MENU CONTROL */}
      <div className='absolute flex flex-row-rever gap-1 bottom-3 left-1/2 -translate-x-1/2 z-50 bg-gray-200 p-2 rounded-md'>
        <a href={"interactives?map-id=10005&map-type=1"} className="font-bold text-4xl p-4 rounded-full text-black bg-white border-blue-700 border">PFD</a>
        <a href={'/interactives?map-id=10003&map-type=3'} className='font-bold text-4xl p-4 rounded-lg text-black'> PND</a>
      </div>


      {/* LEFT DATA INFORMATION SHOW */}
      <div className={`absolute  text-black p-3 flex flex-col transition-all duration-500 h-5/6 right-0 m-auto top-0 bottom-0 ${selectedShape !== null && !closeInformation ? 'w-1/4 opacity-100' : 'w-0 opacity-0'} bg-slate-200 z-50 rounded-r border`}>

        {/* {
          renderLeftInformation === null || selectedShape === null ? <div className='w-full h-full flex flex-col justify-center items-center'>
            <Spinner />
          </div> : <div className='h-full w-full overflow-hidden flex flex-col'>
            {renderLefInfo(Number(entityType))}
            <Button onClick={() => {
              setAlertDeleteShape(true)
            }} className='flex flex-row justify-between items-center'>
              <h1>Eliminar Shape</h1>
              <FaTrash />
            </Button>
          </div>
        } */}
        <div className='flex flex-row justify-between items-center right-0 top-0  bg-[#030F2E] w-full h-[40px]'>
          <p className='text-white ml-2 font-bold'>{entityType === 3 ? 'Informacion adicional de equipo' : 'Informacion de Reportes'}</p>
          <FaWindowClose className='cursor-pointer' onClick={() => { setCloseInformation(true), setSelectedShape(null) }} size={35} color='white' />
        </div>

        <div className='flex flex-row items-center justify-between bg-gray-500 p-2'>
          <h1 className='font-bold text-white'>Reporte de Condición</h1>
          {/* <button onClick={() => { console.log("Cerrar reporte"), setShowPanel(false) }} >
              <FaCircleXmark className='text-white' size={25} />
            </button> */}
        </div>
        <div className='flex flex-col gap-2 px-2 text-sm bg-gray-200 h-1/3 overflow-y-auto py-2'>
          <h1 className='font-bold text-black text-center'>
            No existe reportes</h1>
          {/* <div className='flex flex-col gap-1 p-2 bg-white rounded-md text-black'>
                <h1 className='font-bold'>REP-001_25 - 0210-CV-004</h1>
                <p>Fecha: 2023-10-01</p>
                <p>Estado: Normal </p>
              </div>
              <div className='flex flex-col gap-1 p-2 bg-white rounded-md text-black'>
                <h1 className='font-bold'>REP-001_25 - 0210-CV-004</h1>
                <p>Fecha: 2023-10-01</p>
                <p>Estado: Normal </p>
              </div>
              <div className='flex flex-col gap-1 p-2 bg-white rounded-md text-black'>
                <h1 className='font-bold'>REP-001_25 - 0210-CV-004</h1>
                <p>Fecha: 2023-10-01</p>
                <p>Estado: Normal </p>
              </div> */}
        </div>
        <div className='flex flex-col text-sm h-1/3'>
          {/* Header */}
          <div
            className='flex flex-row justify-between gap-1 p-2 bg-gray-500 rounded-md cursor-pointer'
            onClick={() => setIsOpen(!isOpen)}
          >
            <h1 className='font-bold text-white'>Información de Equipo</h1>
            {isOpen ? (
              <FaAngleUp className='text-white' size={20} />
            ) : (
              <FaAngleDown className='text-white' size={20} />
            )}
          </div>

          {/* Contenido colapsable */}
          <div
            className={`overflow-y-auto transition-all duration-500 ${isOpen ? 'max-h-1/3 opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            <div className='flex flex-col gap-2 px-5 py-2 bg-gray-100 rounded-md text-xs'>
              <div className='flex flex-col gap-1 text-black'>
                <h1 className='font-bold border-b-2 border-black'>TAG:</h1>
                <p>B-2020</p>
              </div>
              <div className='flex flex-col gap-1 text-black'>
                <h1 className='font-bold border-b-2 border-black'>Nombre:</h1>
                <p>Enfriador Seccional</p>
              </div>
              <div className='flex flex-col gap-1 text-black'>
                <h1 className='font-bold border-b-2 border-black'>Proceso Asociado:</h1>
                <p>Planta Tostación - 02</p>
              </div>
              <div className='flex flex-col gap-1 text-black'>
                <h1 className='font-bold border-b-2 border-black'>Características:</h1>
                <div>
                  <p>No existen características</p>
                  {/* <p>Tipo: Válvula de Control</p>
                      <p>Marca: Emerson</p>
                      <p>Modelo: 1234-5678</p>
                      <p>Serial: 987654321</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col text-sm bg-white  h-1/3 gap-2'>
          <div
            className='flex flex-row justify-between gap-1 p-2 bg-gray-500 rounded-md cursor-pointer'
          // onClick={() => setIsOpen(!isOpen)}
          >
            <h1 className='font-bold text-white'>Opciones de Equipo</h1>
            {isOpen ? (
              <FaAngleUp className='text-white' size={20} />
            ) : (
              <FaAngleDown className='text-white' size={20} />
            )}
          </div>
          <div className='grid grid-cols-4 gap-1 px-2 text-black'>
            <button className='flex flex-col hover:bg-gray-400 rounded-md items-center justify-center p-2 bg-gray-200 gap-1'>
              <Image
                src="/img/icons/ico-28.svg"
                alt="Mantenimiento"
                width={50}
                height={50}
              />
              <span className='text-xs'>Despiece</span>
            </button>
            <button className='flex flex-col hover:bg-gray-400 rounded-md items-center justify-center p-2 bg-gray-200 gap-1'>
              <Image
                src="/img/icons/ico-29.svg"
                alt="Mantenimiento"
                width={50}
                height={50}
              />
              <span className='text-xs'>Reportes Mantenimiento</span>
            </button>
            <button className='flex flex-col hover:bg-gray-400 rounded-md items-center justify-center p-2 bg-gray-200 gap-1'>
              <Image
                src="/img/icons/ico-30.svg"
                alt="Mantenimiento"
                width={50}
                height={50}
              />
              <span className='text-xs'>Videos Asociados</span>
            </button>
            <button className='flex flex-col hover:bg-gray-400 rounded-md items-center justify-center p-2 bg-gray-200 gap-1'>
              <Image
                src="/img/icons/ico-31.svg"
                alt="Mantenimiento"
                width={50}
                height={50}
              />
              <span className='text-xs'>Historico de Fotos</span>
            </button>
            <button className='flex flex-col hover:bg-gray-400 rounded-md items-center justify-center p-2 bg-gray-200 gap-1'>
              <Image
                src="/img/icons/ico-32.svg"
                alt="Mantenimiento"
                width={50}
                height={50}
              />
              <span className='text-xs'>Ordenes de Trabajo</span>
            </button>
            <button className='flex flex-col hover:bg-gray-400 rounded-md items-center justify-center p-2 bg-gray-200 gap-1'>
              <Image
                src="/img/icons/ico-33.svg"
                alt="Mantenimiento"
                width={50}
                height={50}
              />
              <span className='text-xs'>Historial de Fallas</span>
            </button>
            <button className='flex flex-col hover:bg-gray-400 rounded-md items-center justify-center p-2 bg-gray-200 gap-1'>
              <Image
                src="/img/icons/ico-34.svg"
                alt="Mantenimiento"
                width={50}
                height={50}
              />
              <span className='text-xs'>Planes Mantto</span>
            </button>
            <button className='flex flex-col hover:bg-gray-400 rounded-md items-center justify-center p-2 bg-gray-200 gap-1'>
              <Image
                src="/img/icons/ico-35.svg"
                alt="Mantenimiento"
                width={50}
                height={50}
              />
              <span className='text-xs'>Listado de Repuestos</span>
            </button>
          </div>
        </div>
      </div>

      {
        controlMinimized ? <FaSquarePlus onClick={() => { setControlMinimized(false) }} className='absolute top-0 right-0' size={30} color='black' /> : null
      }
      {
        openShapeDialog ? <ShapesPlanDialog setFlagRefresh={setFlagRefresh} dialogOpen={openShapeDialog} setDialogOpen={setopenShapeDialog} planShape={planShape} setPlanShape={setPlanShape} /> : null
      }

      {
        openViewMedia ? <ModalViewMedia open={openViewMedia} setOpen={setOpenViewMedia} information={openMediaInfo} type={openMediaInfo.type} /> : null
      }
      {
        alertDeleteShape ? <AlertDeleteDialog executeMethod={onDelete} objName='Shape' open={alertDeleteShape} setOpen={setAlertDeleteShape} /> : null
      }
    </div>
  )
}
