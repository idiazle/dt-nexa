"use client"
import React, { act, useEffect, useRef, useState } from 'react'
import { MapContainer, ImageOverlay, FeatureGroup } from "react-leaflet";
import { LatLngExpression, LatLngTuple, map } from 'leaflet';
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
import { TbTriangleSquareCircleFilled, TbView360Number } from "react-icons/tb";
import { FaAngleDown, FaAngleLeft, FaAngleRight, FaAnglesLeft, FaAnglesRight, FaAngleUp, FaBars, FaFile, FaLeaf, FaSquarePlus, FaTrash, FaX } from "react-icons/fa6";
import ShapesPlanDialog from '../admin/plans/shapes-plan-dialog';
import { EyeClosedIcon } from '@radix-ui/react-icons';
import { EyeIcon, X } from 'lucide-react';
import ViewShapes from './view-shapes';
import Spinner from '../ui/spinner';
import { FaAngleDoubleRight, FaCircle, FaWindowClose } from "react-icons/fa";
import ModalViewMedia from '../viewers/modal-viewer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { deleteShapeById, putShapeById } from '@/api/shapes-api'
import { toast } from '../ui/use-toast'
import AlertDeleteDialog from '../general/alert-delete-dialog';
import InformationEquipmentComponent from '../interactives/information-eq';
import Link from 'next/link';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { UserInfoMenu } from '../auth/user-info-menu';
import { useSearchParams } from 'next/navigation';
import { getEntityInfo } from '@/api/admin/entities-api';
import { getDocumentsByEntity } from '@/api/admin/documents-api';
import { getReportCondById } from '@/api/admin/reports-api';
import OptionsNav from '../interactives/options-nav';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { MdOutlineClose } from 'react-icons/md';
import Node360Viewer from '../admin/nodes360/node360-viewer';
import { getNodes360 } from '@/api/admin/nodes360-api';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { IoNotifications } from 'react-icons/io5'
import AlertsList from '../alerts/alerts-list';
import NavBarInteractives from '../interactives/navBarInteractives';
import Draggable, { DraggableCore } from 'react-draggable';
import { Resizable } from 're-resizable'
import { AiOutlineFullscreen } from 'react-icons/ai';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { getImagenesByEquipment } from '@/api/admin/imagenes-api';
import { Label } from '../ui/label';

interface MapProps {
  mapSelected: Map2dStructure | null
  posix: LatLngExpression | LatLngTuple,
  zoom?: number,
}

interface MenuBtns {
  id: number
  show_name: string
  hide_name: string
  icon: any
  active: boolean
}

const options = [
  // {
  //   label: 'Despiece',
  //   url: '/img/icons/ico-28.svg',
  // },
  {
    label: 'Reportes Mantto',
    url: '/img/icons/ico-29.svg',
  },
  {
    label: 'Videos Asociados',
    url: '/img/icons/ico-30.svg',
  },
  {
    label: 'Historial Fotos',
    url: '/img/icons/ico-31.svg',
  },
  {
    label: 'Historial OT',
    url: '/img/icons/ico-32.svg',
  },
  {
    label: 'Historial Fallas',
    url: '/img/icons/ico-33.svg',
  },
  {
    label: 'Planes Mantto',
    url: '/img/icons/ico-34.svg',
  },
  {
    label: 'Listado Repuestos',
    url: '/img/icons/ico-35.svg',
  },
]

const navMaps = [
  {
    map_id: '10009',
    map_type: '1',
    label: 'Planta Tostación S25-1',
  },
  {
    map_id: '10006',
    map_type: '1',
    label: 'Planta Tostación S25-2',
  },
  {
    map_id: '20014',
    map_type: '1',
    label: 'Planta Tostación S25-3',
  },

]


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
  const user = session?.user?.groups.find((obj: any) => obj === 2 || obj === 4)
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
  const [isOpen2, setIsOpen2] = useState<boolean>(true)
  const [isOpen3, setIsOpen3] = useState<boolean>(false)
  const [planeSelected, setPlaneSelected] = useState<string>('2')
  const [activateEquipments, setActivateEquipments] = useState<boolean>(false)

  const [infoShape, setInfoShape] = useState<{
    entity_data: EntityStructure | EquipmentStructure
    documents: DocumentStructure[]
  } | null>(null)

  const searchParams = useSearchParams()
  const mapType = searchParams.get('map-type')
  const mapId = searchParams.get('map-id')

  const getDataInfoShape = async () => {
    try {
      if (!selectedShape?.entity_id) {
        return null;
      }
      const responseEntity = await getEntityInfo(selectedShape.entity_id.id)
      const response = await getDocumentsByEntity(Number(selectedShape.entity_id.id), Number(selectedShape.entity_id.type))
      console.log("RESPONSE ENTITY", responseEntity.data.data);
      console.log("RESPONSE DOCUMENTS", response.data.data);

      setInfoShape((prevstate: any) => {
        return {
          ...prevstate,
          entity_data: responseEntity.data.data,
          documents: response.data.data as DocumentStructure[]
        }
      })
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    if (selectedShape !== null) {
      getDataInfoShape()
    }
  }, [selectedShape, flagRefresh])

  const [reportsEquipment, setReportsEquipment] = useState<any[]>([])
  const [fileSelected, setFileSelected] = useState<any | null>(null)
  const [openDialogDoc, setOpenDialogDoc] = useState<boolean>(false)

  const handleViewDoc = (file: any) => {
    setFileSelected({
      data: {
        title: file.filename,
        file_url: file.file,
        name: file.filename,
        filename: file.filename,
      }
    })
    setOpenDialogDoc(true)
  }

  const [generalCondition, setGeneralCondition] = useState<number>(0)
  const [colorCondition, setColorCondition] = useState<string>('')

  const renderColor = (option: number) => {
    let color = ''
    if (option === 1) {
      color = 'red'
    } else if (option === 2) {
      color = 'orange'
    } else if (option === 3) {
      color = 'yellow'
    } else if (option === 4) {
      color = 'green'
    } else if (option === 5) {
      color = 'gray'
    } else {
      color = 'white'
    }
    return color
  }

  const getReportEquipment = () => {
    const entityData = infoShape?.entity_data as EquipmentStructure;
    if ('equipment_id' in entityData && entityData.equipment_id !== undefined) {
      getReportCondById(Number(entityData.equipment_id)).then((response) => {
        console.log("RESPONSE REPORTS", response.data.data);
        setReportsEquipment(response.data.data)
      }).catch((error) => {
        console.error("Error fetching reports:", error);
      })
    }
  }

  useEffect(() => {
    if (infoShape !== null) {
      getReportEquipment();
    }
  }, [infoShape])

  useEffect(() => {
    if (reportsEquipment !== null) {
      const condition = reportsEquipment.map((obj) => {
        return Number(obj.cond)
      })
      const minCondition = Math.min(...condition)
      setGeneralCondition(minCondition)
      if (setColorCondition !== null && setColorCondition !== undefined) {
        setColorCondition(String(minCondition))
      }
    }
  }, [reportsEquipment])

  const [activeNavigation, setActiveNavigation] = useState<boolean>(false)

  useEffect(() => {
    if (mapType === '1') {
      setActiveNavigation(true)
    } else {
      setActiveNavigation(false)
    }
  }, [])

  const [activeLegend, setActiveLegend] = useState<boolean>(false)
  const [openDespiece, setOpenDespiece] = useState<boolean>(false)
  const [reportSelected, setReportSelected] = useState<boolean>(false)
  const [view360Selected, setView360Selected] = useState<boolean>(false)
  const [allNodes, setAllNodes] = useState<any[]>([])
  const [nodeSelected, setNodeSelected] = useState<any>(null)
  const [nodesFilter, setNodesFilter] = useState<any[]>([])

  console.log("MAP SELECTED", selectedShape);

  const currentIndex = navMaps.findIndex(map => map.map_id === mapId);
  const prevMap = currentIndex > 0 ? navMaps[currentIndex - 1] : null;
  const nextMap = currentIndex < navMaps.length - 1 ? navMaps[currentIndex + 1] : null;


  //ALERTS VARIABLES
  const [openListAlerts, setOpenListsAlerts] = useState<boolean>(false)


  useEffect(() => {
    getNodes360().then((response) => {
      console.log("RESPONSE NODES 360", response.data.data);
      setAllNodes(response.data.data)
    }).catch((error) => {
      console.error("Error fetching nodes 360:", error);
    })
  }, [])

  console.log("Equipment Selected", equipmentSelected?.obj.entity_id.id);

  const searchNodeByEquipmentId = () => {
    let tempNodes: any[] = []
    allNodes.map((obj, index) => {
      const temp = JSON.parse(obj.markers)
      temp?.map((v360: any) => {
        if (Number(v360?.equipment_id) === equipmentSelected?.obj.entity_id.id) {
          tempNodes.push(obj)
        }
      })
      setNodeSelected(tempNodes[0])
      setNodesFilter(tempNodes)
      console.log("nuevo", tempNodes);
    })
  }

  useEffect(() => {
    if (view360Selected === true) {
      searchNodeByEquipmentId()
    }
  }, [view360Selected])

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

  const refVentana = useRef<HTMLDivElement>(null)

  const toggleFullScreen = () => {
    const el = refVentana.current
    if (el && !document.fullscreenElement) {
      el.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }
  const [openGallery, setOpenGallery] = useState<boolean>(false)
  type ImagesByEquipmentType = {
    name?: string;
    description?: string;
    uploaded_files: { file: string }[];
  } | null;
  const [imagesByEquipment, setImagesByEquipment] = useState<ImagesByEquipmentType>(null)
  const [imageSelected, setImageSelected] = useState<any>(null)

  useEffect(() => {
    if (openGallery && equipmentSelected) {
      console.log("Eqipment selected:", equipmentSelected?.obj.entity_id.id);
      getImagenesByEquipment(equipmentSelected?.obj.entity_id.id).then((response) => {
        console.log("RESPONSE IMAGES", response.data.data[response.data.data.length - 1]);
        setImagesByEquipment(response.data.data[response.data.data.length - 1])
      }).catch((error) => {
        console.error("Error fetching images:", error);
      })
    }
  }, [openGallery, equipmentSelected]);


  return (
    <div className='flex flex-col w-full h-full relative overflow-hidden' ref={refDivOverflow}>
      <div className='relative w-full h-full'>
        <NavBarInteractives />
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
            user !== undefined || admin !== undefined ?
              <>
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
                    </FeatureGroup> : null
                }
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
                  setReportSelected={setReportSelected}
                />
              </> : null
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
            setReportSelected={setReportSelected}
            set360ViewSelected={setView360Selected}
            setOpenGallery={setOpenGallery}
            openGallery={openGallery}
          /> : null
      }
      {
        openGallery && (
          <div className='flex flex-row absolute z-50 top-14 right-2 gap-2'>
            <div className='w-[1000px] max-h-[60vh] min-h-[60vh] bg-gray-200 text-black rounded-md p-2 border-gray-400 border-2 shadow-lg flex flex-col gap-2'>

              {/* Encabezado */}
              <div className='p-2 flex flex-row bg-[#002645] rounded-md justify-between items-center'>
                <h1 className='text-white font-bold'>Galería de imágenes</h1>
                <button
                  onClick={() => {
                    setOpenGallery(false)
                    setImageSelected(null)
                    setImagesByEquipment(null)
                  }}
                  className='text-white font-bold hover:bg-gray-400 rounded-md p-1'>
                  <FaX size={20} />
                </button>
              </div>

              {/* Información del equipo */}
              <div className='flex flex-col gap-2 px-2'>
                <div className='flex flex-row gap-2 items-center'>
                  <Label className='font-bold'>Nombre: </Label>
                  <h1>{imagesByEquipment?.name}</h1>
                </div>
                <div className='flex flex-row gap-2 items-center'>
                  <Label className='font-bold'>Descripción: </Label>
                  <p>{imagesByEquipment?.description}</p>
                </div>
              </div>
              {/* Imagen principal */}
              <div className='flex-grow flex justify-center items-center overflow-hidden bg-white rounded-md'>
                {imageSelected?.file ? (
                  <Image
                    src={imageSelected.file}
                    alt="Imagen seleccionada"
                    width={800}
                    height={400}
                    className='rounded-md object-contain max-h-full max-w-full'
                  />
                ) : (
                  <p className="text-gray-500">Selecciona una imagen</p>
                )}
              </div>

              {/* Miniaturas */}
              <div className='flex flex-row gap-2 overflow-x-auto py-2'>
                {
                  imagesByEquipment ? (
                    imagesByEquipment?.uploaded_files.map((image, index) => (
                      <div key={index} className='flex-shrink-0 cursor-pointer justify-center items-center flex flex-col gap-1'>
                        <Image
                          src={image.file}
                          alt={`image-${index + 1}`}
                          width={100}
                          height={100}
                          className='rounded-md object-cover border-2 border-gray-300 hover:border-blue-500 transition-all duration-200'
                          onClick={() => setImageSelected(image)}
                        />
                        <span>Imagen {index + 1}</span>
                      </div>
                    ))
                  ) : (
                    <p >No hay imágenes disponibles</p>
                  )
                }
              </div>
            </div>
          </div>
        )
      }

      {
        mapType === '1' ?
          <div className='absolute top-16 right-3 flex justify-center items-start z-10 bg-opacity-50'>
            <div className='flex flex-col justify-center items-center gap-2 p-2 cursor-pointer bg-gray-400 rounded-md' onClick={() => { setActiveLegend(!activeLegend) }} title='Leyenda de Plano'>
              {
                activeLegend ? <FaAngleRight size={20} className='text-white' /> : <FaAngleLeft size={20} className='text-white' />
              }
              {/* <FaLeaf size={30} className='text-white' /> */}
            </div>
            {
              activeLegend && (
                <div>
                  <Image
                    src="/img/leyenda/leyenda.jpg"
                    alt="leyenda planos"
                    width={280}
                    height={300}
                  />
                </div>

              )
            }
          </div>
          : mapType === '3' ?
            <div className='absolute top-16 right-3 flex justify-center items-start z-20 bg-opacity-50'>
              <div className='flex flex-col justify-center items-center gap-2 p-2 cursor-pointer bg-gray-400 rounded-md' onClick={() => { setActiveLegend(!activeLegend) }} title='Leyenda de Plano'>
                {
                  activeLegend ? <FaAngleRight size={20} className='text-white' /> : <FaAngleLeft size={20} className='text-white' />
                }
              </div>
              {
                activeLegend && (
                  <div className='flex flex-col justify-center items-start gap-2 p-2 cursor-pointer bg-white rounded-md border border-gray-400'>
                    <h1 className='font-bold bg-slate-200 p-2 rounded-sm'>Leyenda de íconos</h1>
                    <div className='flex flex-row justify-center items-center gap-2'>
                      <Image
                        src="/img/icons/paux.svg"
                        alt="leyenda planos"
                        width={20}
                        height={20}
                      />
                      <span className='text-sm'>Punto Equipo</span>
                    </div>
                    <div className='flex flex-row justify-center items-center gap-2'>
                      <Image
                        src="/img/icons/pnav.svg"
                        alt="leyenda planos"
                        width={20}
                        height={20}
                      />
                      <span className='text-sm'>Punto Navegación</span>
                    </div>
                    <div className='flex flex-row justify-center items-center gap-2'>
                      <Image
                        src="/img/icons/peq.svg"
                        alt="leyenda planos"
                        width={20}
                        height={20}
                      />
                      <span className='text-sm'>Punto Auxiliar</span>
                    </div>
                  </div>
                )
              }
            </div>
            : null
      }
      {
        //Cambio de imagen
        activeNavigation && (mapId === "10006" || mapId === "10009" || mapId === "20014") ?
          (
            <div>
              {prevMap && (
                <a
                  href={`/interactives?map-id=${prevMap.map_id}&map-type=${prevMap.map_type}`}
                  title="Anterior plano"
                  className="absolute left-0 z-10 flex justify-center items-center bg-gray-400 opacity-50 top-1/2 p-2 rounded-md ml-5"
                >
                  <FaAnglesLeft size={70} className="text-gray-200" />
                </a>
              )}
              {nextMap && (
                <a
                  href={`/interactives?map-id=${nextMap.map_id}&map-type=${nextMap.map_type}`}
                  title="Siguiente plano"
                  className="absolute right-0 z-10 flex justify-center items-center bg-gray-400 opacity-50 top-1/2 p-2 rounded-md mr-5"
                >
                  <FaAnglesRight size={70} className="text-gray-200" />
                </a>
              )}
            </div>
          ) : null
      }

      {/* TOP MENU CONTROL */}
      <div className='absolute top-14 left-1/2 -translate-x-1/2 z-50 flex flex-row gap-2'>
        <h1 className='bg-gray-500 text-white font-bold p-2 rounded-md text-2xl uppercase'>{Map.mapSelected?.name}</h1>
      </div>
      <div className={`absolute transition-all duration-500 left-14 bottom-20 flex justify-center items-center ${!controlMinimized ? 'opacity-100' : 'opacity-0'} w-7 h-7`}>
        <div className='flex justify-center items-center w-full h-full bg-[#ffffff] text-white transition-all duration-300'>
          {/* <FaSquareMinus size={20} className='absolute right-0 top-0 hover:cursor-pointer' onClick={() => { setControlMinimized(true) }} /> */}
          {
            actionMenuBtns.map((obj) => {
              return (
                <TooltipProvider delayDuration={300} key={obj.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          // setActivateEquipments(!activateEquipments)
                          handleClickBtn(obj)
                        }}
                        className={`text-xl p-2 flex items-center justify-center text-black bg-white border-2 border-blue-600 gap-2 rounded-full w-24`}>
                        {
                          obj.active ? null : <FaCircle size={25} color='red' />
                        }
                        <h1 className='font-bold'>{obj.active ? 'ON' : 'OFF'}</h1>
                        {
                          obj.active ? <FaCircle size={25} color='green' /> : null
                        }
                      </button>
                      {/* <Button
                        key={obj.id}
                        className='rounded-sm h-full w-full bg-[#ffffff] border-[#cccccc] hover:bg-[#eeeeee]' size={'icon'} variant={'outline'} onClick={() => handleClickBtn(obj)}
                      > */}
                      {/* <div className='flex flex-col justify-center items-center'>
                                                    <div className='flex flex-row justify-center items-center gap-3'> */}
                      {/* {obj.icon} */}
                      {/* {
                          obj.active
                            ? <EyeIcon size={20} color='#464646' />
                            : <EyeClosedIcon fontSize={20} color='#464646' />
                        } */}
                      {/* </div> */}
                      {/* <EyeIcon/> */}
                      {/* <p className='text-xs'>{!obj.active ? obj.show_name : obj.hide_name}</p> */}
                      {/* </div> */}
                      {/* </Button> */}
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

      {/* LEFT BOTTOM MENU CONTROL */}
      {/* <div className='absolute bottom-20 left-5 flex flex-col items-center w-32 gap-2'>
        <button
          onClick={() => {
            setActivateEquipments(!activateEquipments)
          }}
          className={`text-xl p-2 flex items-center justify-center text-black bg-white border-2 border-blue-600 gap-2 rounded-full w-24`}>
          {
            activateEquipments ? <FaCircle size={25} color='red' /> : null
          }
          <h1 className='font-bold'>{activateEquipments ? 'OFF' : 'ON'}</h1>
          {
            activateEquipments ? null : <FaCircle size={25} color='green' />
          }
        </button>
      </div> */}


      {/* CENTER BOTTOM MENU CONTROL */}
      <OptionsNav />

      {
        view360Selected ?
          // <div className='absolute bottom-2 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 bg-gray-200 w-[90%] h-[90%] rounded-md p-4'>
          //   <div className='flex flex-row items-center w-full gap-2 justify-between'>
          //     <h1 className=' bg-white py-1 px-4 text-lg font-bold rounded-md w-full'>
          //       Imagen 360
          //     </h1>
          //     <MdOutlineClose className='bg-white p-1 h-full rounded-md cursor-pointer hover:bg-gray-400' size={30} color='black' onClick={() => { setView360Selected(false), setSelectedShape(null) }} />
          //   </div>
          //   <div className='w-full h-full bg-red-400 rounded-md'>
          //     <div className='flex flex-row justify-center items-center w-full bg-gray-300 rounded-md gap-2 overflow-auto p-10'>
          //       {
          //         nodesFilter.map((obj: any) => {
          //           return (

          //             < Image
          //               key={obj.id}
          //               src={obj?.thumbnail}
          //               alt="Imagen 360"
          //               width={150}
          //               height={150}
          //               className='object-cover rounded-md'
          //             // onClick={() => {
          //             //   setNodeSelected(null)
          //             //   setView360Selected(false)
          //             //   setSelectedShape(null)
          //             // }
          //             />
          //           )
          //         })
          //       }
          //     </div>
          //     <ReactPhotoSphereViewer
          //       src={nodesFilter[0].panorama}
          //       width='100%'
          //       height='100%'
          //       navbar={false}
          //       container={'container-360'}
          //       // plugins={plugins}
          //       mousemove={true}
          //       mousewheel={true}
          //       loadingImg='/img/menu-icons/gemelo_digital.png'
          //     />
          //   </div>
          // </div>
          <Node360Viewer
            allNodes={allNodes}
            selectedNode={nodeSelected}
            dialogOpen={view360Selected}
            setDialogOpen={setView360Selected}
          />
          :
          null
      }

      {/* LEFT DATA INFORMATION SHOW */}
      <div className={`absolute flex flex-col transition-all duration-500 h-[94%] right-0 top-14 bottom-0 ${reportSelected === true && !closeInformation ? 'w-[20%] opacity-100' : 'w-0 opacity-0'} bg-slate-100 z-20 border rounded-l-md`}>

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
        <div className='flex flex-row justify-between items-center right-0 top-0  bg-[#e9851e] w-full h-[40px] rounded-tl-md px-2'>
          <p className='text-white ml-2 text-lg font-bold uppercase'>
            {entityType === 3
              ? `Informacion adicional de equipo ${infoShape?.entity_data.name}`
              : `${'tag' in (infoShape?.entity_data ?? {}) ? (infoShape?.entity_data as EquipmentStructure).tag : ''} - ${infoShape?.entity_data.name}`}
          </p>
          <FaX className='cursor-pointer' onClick={() => { setCloseInformation(true), setSelectedShape(null) }} size={20} color='white' />
        </div>

        {/* <div className='flex flex-row items-center justify-between bg-[#e9851e] p-2'>
          <h1 className='font-bold text-white'>Reporte de Condición</h1>
          <button onClick={() => { console.log("Cerrar reporte"), setShowPanel(false) }} >
              <FaCircleXmark className='text-white' size={25} />
            </button>
        </div> */}

        <Tabs defaultValue="reports" className=''>
          <TabsList className='flex flex-row w-full bg-white rounded-md gap-1'>
            <TabsTrigger value="reports" className='w-1/3 bg-gray-300 hover:bg-gray-500 hover:text-white'>Reportes</TabsTrigger>
            <TabsTrigger value="information" className='w-1/3 bg-gray-300 hover:bg-gray-500 hover:text-white'>Información</TabsTrigger>
            <TabsTrigger value="options" className='w-1/3 bg-gray-300 hover:bg-gray-500 hover:text-white'>Opciones</TabsTrigger>
          </TabsList>
          <TabsContent value="reports" className=''>
            <div
              className='flex flex-row justify-between gap-1 p-2 bg-gray-500 cursor-pointer'
              onClick={() => setIsOpen3(!isOpen3)}
            >
              <h1 className='font-bold text-white'>Reportes de Equipo</h1>
            </div>
            <div className={`flex flex-col gap-1 p-2 bg-gray-200 h-auto max-h-[33%] overflow-y-auto`}>
              {
                reportsEquipment !== undefined && reportsEquipment !== null && reportsEquipment.length > 0 ? reportsEquipment.map((obj: any, index: number) => {
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        console.log("Click on report", obj);
                        handleViewDoc(obj)
                      }}
                      className='flex flex-col gap-1 p-2 bg-white rounded-md text-black items-start'
                    >
                      <h1 className='font-bold text-lg truncate max-w-full' title={obj.filename}>{obj.filename}</h1>
                      <p className=' flex flex-row items-center gap-4 text-lg'>
                        Estado: <FaCircle color={renderColor(generalCondition)} size={30} className=' rounded-full' /> - {
                          generalCondition === 1 ? 'Alerta'
                            : generalCondition === 2 ? 'Precaución'
                              : generalCondition === 3 ? 'Tolerable'
                                : generalCondition === 4 ? 'Normal'
                                  : generalCondition === 5 ? 'No monitoreado'
                                    : generalCondition === 6 ? 'No aplica'
                                      : ''
                        }
                      </p>
                      <p className='text-sm'>Fecha: {new Date(obj.created_at).toLocaleDateString()}</p>
                    </button>
                  )
                }) : (
                  <div className='flex flex-col gap-1 p-2 bg-white rounded-md text-black'>
                    <p>No hay reportes disponibles</p>
                  </div>
                )
              }
              {/* <div className='flex flex-col gap-1 p-2 bg-white rounded-md text-black'>
            <h1 className='font-bold text-lg'>REP-001_25 - 0210-CV-004</h1>
            <p className='text-sm'>Fecha: 20/03/2025</p>
            <p className='text-sm flex flex-row items-center gap-4'>Estado: <FaCircle size={20} color='green' /> </p>
          </div> */}
            </div>
          </TabsContent>
          <TabsContent value="information" className=''>
            <div className='flex flex-col text-sm h-auto bg-white overflow-hidden'>
              {/* Header */}
              <div
                className='flex flex-row justify-between gap-1 p-2 bg-gray-500 cursor-pointer'
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
              <div className={`transition-all duration-500 ${isOpen ? 'max-h-1/3 opacity-100' : 'max-h-0 opacity-0'}`} >
                <div className='flex flex-col gap-3 px-7 py-2'>
                  <div className='flex flex-col gap-1 text-black'>
                    <h1 className='font-bold border-b-2 border-black'>Proceso Asociado:</h1>
                    <p className='ml-4'>{'parent_data' in (infoShape?.entity_data ?? {}) && (infoShape?.entity_data as any)?.parent_data?.name ? (infoShape?.entity_data as any).parent_data.name : 'Sin proceso asociado'}</p>
                  </div>
                  <div className='flex flex-col gap-1 text-black'>
                    <h1 className='font-bold border-b-2 border-black'>TAG:</h1>
                    <p className='ml-4'>{'tag' in (infoShape?.entity_data ?? {}) ? (infoShape?.entity_data as any).tag : ''}</p>
                  </div>
                  <div className='flex flex-col gap-1 text-black'>
                    <h1 className='font-bold border-b-2 border-black'>Nombre:</h1>
                    <p className='ml-4'>{infoShape?.entity_data.name}</p>
                  </div>
                  <div className='flex flex-col gap-1 text-black'>
                    <h1 className='font-bold border-b-2 border-black'>Características:</h1>
                    <div className='flex flex-col gap-1 ml-4'>
                      {
                        (selectedShape !== null && infoShape !== null && 'properties' in infoShape.entity_data && infoShape.entity_data.properties) ?
                          JSON.parse((infoShape.entity_data as any).properties)?.filter((obj2: any) => obj2.value !== '')?.map((obj: any, index: number) => {
                            return (
                              <div className='flex flex-row justify-between items-center gap-2' key={index}>
                                <FaCircle size={6} />
                                <p className='w-1/3'>{obj.label}</p>
                                <p className='w-2/3'>{obj.value}</p>
                              </div>
                            )
                          }) : <div>
                            <p className='text-gray-500'>No hay características disponibles</p>
                          </div>
                      }
                    </div>
                  </div>
                  <div className='flex flex-col gap-1 text-black'>
                    <h1 className='font-bold border-b-2 border-black text-black'>Documentos:</h1>
                    <div className='gap-1 flex flex-col overflow-auto h-[80%] ml-4'>
                      {
                        infoShape?.documents && infoShape.documents.length > 0 ? infoShape.documents.map((obj: any, index: number) => {
                          const document = obj.document_id as DocumentStructure
                          return (
                            <button key={index} className=' text-black flex flex-row items-center text-start gap-2 p-1 hover:bg-gray-300 rounded-sm bg-gray-200' onClick={() => onSetViewDoc(document)}>
                              <FaFile size={15} />
                              <p className='text-sm'>{document.title}</p>
                            </button>
                          )
                        }) : <p className='text-black'>No hay documentos disponibles</p>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="options" className=''>
            <div className='flex flex-col text-sm bg-white h-auto gap-2'>
              <div
                className='flex flex-row justify-between gap-1 p-2 bg-gray-500 rounded-sms cursor-pointer'
                onClick={() => setIsOpen2(!isOpen2)}
              >
                <h1 className='font-bold text-white'>Opciones de Equipo</h1>
                {isOpen2 ? (
                  <FaAngleUp className='text-white' size={20} />
                ) : (
                  <FaAngleDown className='text-white' size={20} />
                )}
              </div>
              {/* <div className={`overflow-y-auto transition-all duration-500 ${isOpen ? 'max-h-1/3 opacity-100' : 'max-h-0 opacity-0'}`} ></div> */}
              <div className={`grid grid-cols-4 gap-1 px-2 text-white items-start ${isOpen2 ? 'max-h-1/3 opacity-100' : 'max-h-0 opacity-0'}`}>
                {
                  selectedShape && selectedShape.id === 62 ?
                    <button
                      onClick={() => {
                        setOpenDespiece(true)
                      }}
                      className='flex flex-col  bg-[#002645] rounded-md items-center justify-start p-2 h-full gap-1 cursor-pointer hover:opacity-70'>
                      <Image
                        src={'/img/icons/ico-28.svg'}
                        alt={'Despiece'}
                        width={80}
                        height={60}
                      />
                      <span className='font-bold'>Despiece</span>
                    </button>
                    :
                    <button
                      disabled
                      // href='https://nexa-b2025.dportal.app'
                      className='flex flex-col  bg-slate-700 rounded-md items-center justify-start p-2 h-full gap-1 opacity-50'>
                      <Image
                        src={'/img/icons/ico-28.svg'}
                        alt={'Despiece'}
                        width={80}
                        height={60}
                      />
                      <span className='font-bold'>Despiece</span>
                    </button>
                }
                {
                  options.map((option, index) => {
                    return (
                      <>
                        <button disabled className='flex flex-col  bg-slate-700 rounded-md items-center justify-start p-2 h-full gap-1 opacity-50'>
                          <Image
                            src={option.url}
                            alt={option.label}
                            width={80}
                            height={60}
                          />
                          <span className='font-bold'>{option.label}</span>
                        </button>
                      </>
                    )
                  }
                  )
                }
              </div>

              {/* <Draggable> */}

              {/* <Dialog open={openDespiece} onOpenChange={setOpenDespiece}>
              <DialogContent className='max-w-[75%] h-[75%] bg-gray-200'>
                <DialogHeader className='bg-blue-300'>
                <DialogTitle className=''>B025 -  MOLINO DE BOLAS</DialogTitle>
              </DialogHeader>
                <div>
                  <h1 className='font-bold text-lg pb-3'>
                    B025 -  MOLINO DE BOLAS
                  </h1>
                  <iframe className='w-full h-[95%]' src="https://nexa-b2025.dportal.app"></iframe>
                </div>
              </DialogContent>
            </Dialog>
          </Draggable> */}
            </div>
          </TabsContent>
        </Tabs>



      </div>
      {
        openDespiece ?
          <div className="fixed top-16 left-3 w-full h-full z-10">
            <Draggable handle=".handle">
              <Resizable
                defaultSize={{ width: 720, height: 420 }}
                minWidth={400}
                minHeight={300}
                maxWidth="100vw"
                maxHeight="100vh"
                className='absolute p-2 rounded-md border-2 border-gray-700 bg-gray-300'
                style={{
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                }}
              >
                <div className="flex flex-col h-full" ref={refVentana}>
                  <div className="handle flex justify-between items-center w-full mb-2 cursor-move">
                    <div className='p-2 flex flex-row bg-[#002645] rounded-md justify-between items-center w-full'>
                      {/* <h1 className='text-white font-bold'>Historial de alertas</h1> */}
                      <h1 className="font-bold text-white ">B025 - MOLINO DE BOLAS</h1>
                      <div className="flex gap-2">
                        <button
                          onClick={toggleFullScreen}
                          className="text-[#002645] bg-white p-1 text-md rounded shadow"
                          title='Pantalla completa'
                        >
                          <AiOutlineFullscreen
                            className="cursor-pointer"
                            size={20} />
                        </button>
                        <button
                          title='Cerrar ventana'
                          className="text-white bg-red-500 p-1 text-md rounded shadow"
                          onClick={() => setOpenDespiece(false)}
                        >
                          <FaX
                            className=" cursor-pointer"
                            size={20}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <iframe
                    className="flex-1 w-full"
                    src="https://nexa-b2025.dportal.app"
                    title="Despiece"
                    style={{ border: 'none' }}
                  />
                </div>
              </Resizable>
            </Draggable>
          </div>
          : null
      }

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
      {
        openDialogDoc
          ? <ModalViewMedia setOpen={setOpenDialogDoc} open={openDialogDoc} information={fileSelected} type={'document'} />
          : null
      }
    </div>
  )
}
