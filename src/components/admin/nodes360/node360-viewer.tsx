//@ts-nocheck
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ReactPhotoSphereViewer,
} from "react-photo-sphere-viewer";
import { VirtualTourPlugin } from "@photo-sphere-viewer/virtual-tour-plugin";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { GalleryPlugin } from "@photo-sphere-viewer/gallery-plugin";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "@photo-sphere-viewer/virtual-tour-plugin/index.css";
import "@photo-sphere-viewer/gallery-plugin/index.css";
import { PhotogrametryStructure } from '@/lib/utils';
import MarkersLinksDialog from './markers-links-dialog';
import { FaAngleDown, FaAngleUp, FaCircle, FaCircleXmark, FaFile } from 'react-icons/fa6';
import { FanIcon } from 'lucide-react';
import Image from 'next/image';
import { getEntityInfo } from '@/api/admin/entities-api';
import Link from 'next/link';
import { FaWindowClose } from 'react-icons/fa';
import { usePathname, useSearchParams } from 'next/navigation';
import { TbView360Number } from 'react-icons/tb';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getReportCondById } from '@/api/admin/reports-api';
import ModalViewMedia from '@/components/viewers/modal-viewer';
import OptionsNav from '@/components/interactives/options-nav';
import NavBarInteractives from '@/components/interactives/navBarInteractives';
import { getDocumentsByEntity } from '@/api/admin/documents-api';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getEquipments } from '@/api/admin/equipments-api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { patchPhotogNodeById } from '@/api/admin/nodes360-api';

interface Nodes360ViewerStructure {
  allNodes: PhotogrametryStructure[] | null
  selectedNode: PhotogrametryStructure | null
  dialogOpen: boolean
  setDialogOpen: (val: boolean) => void
}

const baseUrl = "https://photo-sphere-viewer-data.netlify.app/assets/";
const caption = "Cape Florida Light, Key Biscayne <b>&copy; Pixexid</b>";
const options = [
  {
    label: 'Despiece',
    url: '/img/icons/ico-28.svg',
  },
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

export default function Node360Viewer({ allNodes, selectedNode, dialogOpen, setDialogOpen }: Nodes360ViewerStructure) {
  const pathname = usePathname()
  const isNav360 = pathname.includes('/interactives/nav360')
  const [polygonPoints, setPolygonPoints] = useState<any[]>([])
  const refSpheere = React.createRef<any>()

  const pSRef = React.createRef()
  const [getCurrentNodeFunction, setGetCurrentNodeFunction] = React.useState(null)
  const [showPanel, setShowPanel] = useState<boolean>(false)
  const [infoEquipment, setInfoEquipment] = useState<any>(null);
  const [idEquipment, setIdEquipment] = useState<any>(null);

  const [markersVisible, setMarkersVisible] = useState(true);
  const [markersTourPlugin, setMarkersTourPlugin] = useState<any>(null);

  const handleReady = (instance) => {
    const markersPlugin = instance.getPlugin(MarkersPlugin);
    const virtualTour = instance.getPlugin(VirtualTourPlugin);

    if (!markersPlugin) return;
    setMarkersTourPlugin(markersPlugin); // <-- guardar instancia

    markersPlugin.addEventListener('select-marker', async (marker) => {
      console.log("Marker selected", marker.marker.config.equipment_id);
      setIdEquipment(marker.marker.config.equipment_id);
      setShowPanel(true);
    });

    if (!virtualTour) return;
    if (allNodes !== null && selectedNode !== null) {
      virtualTour.setNodes(
        allNodes.map((obj) => {
          return {
            ...obj,
            links: JSON.parse(obj.links as string),
            markers: JSON.parse(obj.markers as string).map((mark: any, index: number) => ({
              ...mark,
              id: mark?.tooltip + index
            }))
          };
        }),
        selectedNode.id
      );
    }
  };


  const plugins = [
    MarkersPlugin,
    [
      GalleryPlugin,
      {
        thumbnailSize: { width: 100, height: 100 }
      }
    ],
    [
      VirtualTourPlugin,
      {
        renderMode: "3d"
      }
    ]
  ];

  const getDatainfoEquipment = async () => {
    const responseEntity = await getEntityInfo(idEquipment)
    const response = await getDocumentsByEntity(Number(idEquipment), 3)
    console.log("RESPONSE ENTITY", responseEntity.data.data);
    console.log("RESPONSE DOCUMENTS", response.data.data);

    setInfoEquipment((prevstate: any) => {
      return {
        ...prevstate,
        entity_data: responseEntity.data.data,
        documents: response.data.data as DocumentStructure[]
      }
    })
  }

  useEffect(() => {
    if (idEquipment !== null) {
      getDatainfoEquipment();
    }
  }, [idEquipment])

  console.log("ID EQUIPMENT", idEquipment);
  console.log("EQUIPMENT", infoEquipment);

  const [dialogMarkLink, setDialogMarkLink] = useState({
    open: false,
    data: null
  })

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isOpen2, setIsOpen2] = useState<boolean>(true)
  const [isOpen3, setIsOpen3] = useState<boolean>(true)
  const [reportsEquipment, setReportsEquipment] = useState<any[]>([])
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

  const searchParams = useSearchParams()
  const mapType = searchParams.get('map-type')

  const getReportEquipment = () => {
    getReportCondById(Number(idEquipment)).then((response) => {
      console.log("RESPONSE REPORTS", response.data.data);
      setReportsEquipment(response.data.data)
    }).catch((error) => {
      console.error("Error fetching reports:", error);
    })
  }

  useEffect(() => {
    if (idEquipment !== null) {
      getReportEquipment();
    }
  }, [idEquipment])

  useEffect(() => {
    if (reportsEquipment !== null) {
      const condition = reportsEquipment.map((obj) => {
        return Number(obj.cond)
      })
      const minCondition = Math.min(...condition)
      setGeneralCondition(minCondition)
      if (setColorCondition !== null && setColorCondition !== undefined) {
        setColorCondition(minCondition)
      }
    }
  }, [reportsEquipment])


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

  const [open360list, setOpen360List] = useState<boolean>(false)
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

  const handleClick = (instance: any) => {
    if (!instance.data || instance.data.yaw === undefined || instance.data.pitch === undefined) {
      console.warn('⚠️ No se encontró información válida en instance.data:', instance.data)
      return
    }
    console.log('📌 Click detectado en:', instance.data)
    const { yaw, pitch } = instance.data
    const newPoint = [yaw, pitch] // Guardar el punto en formato [yaw, pitch]
    // Agregar el punto al estado y mantener la secuencia de puntos
    setPolygonPoints(prevPoints => [...prevPoints, newPoint])
  }
  // 🎯 Escuchar cambios en polygonPoints y actualizar solo la polilínea
  useEffect(() => {
    if (!pSRef.current) return
    const instance = pSRef.current
    const markersPlugin = instance.getPlugin(MarkersPlugin)
    if (!markersPlugin) return
    markersPlugin.clearMarkers() // Limpiar antes de añadir nuevos
    // 🔹 Dibujar la polilínea solo si hay al menos 2 puntos
    if (polygonPoints.length > 1) {
      markersPlugin.addMarker({
        id: 'polygon-line',
        polygon: polygonPoints, // Usar directamente los puntos en formato [[yaw, pitch], ...]
        svgStyle: {
          fill: 'rgba(13, 85, 158, 0.4)',
          stroke: 'rgba(8, 56, 105, 0.8)',
          strokeWidth: '3px'
        }
      })
    }
    // console.log('🔍 Dibujando polilínea con puntos:', polygonPoints)
  }, [polygonPoints]) // 🔥 Se ejecuta cada vez que cambia polygonPoints

  // const handleSubmitArea = () => {
  //   if (polygonPoints.length < 3) {
  //     console.warn('⚠️ Debes seleccionar al menos 3 puntos para crear un área.')
  //     return
  //   }
  //   // Aquí puedes manejar el envío del área delimitada
  //   console.log('📏 Área delimitada:', polygonPoints)
  //   setPolygonPoints([]) // Limpiar los puntos después de enviar
  // }

  const [equipments, setEquipments] = useState<any[]>([])
  const [equipmentSelected, setEquipmentSelected] = useState<any>({
  })

  const getAllDataInfoEquipment = () => {
    getEquipments().then((response) => {
      console.log("RESPONSE EQUIPMENTS", response.data.data);
      setEquipments(response.data.data)
    }).catch((error) => {
      console.error("Error fetching equipments:", error);
    })
  }

  useEffect(() => {
    getAllDataInfoEquipment()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAreaInputs((prev) => ({
      ...prev,
      [name]: value
    }))
  }


  const handleSubmitArea = () => {
    const polygon = {
      id: 'polyline',
      polygon: polygonPoints,
      svgStyle: {
        fill: 'rgba(13, 85, 158, 0.4)',
        stroke: 'rgba(8, 56, 105, 0.8)',
        strokeWidth: '3px'
      },
      tooltip: {
        content: equipments.find((eq: any) => eq.equipment_id === Number(equipmentSelected))?.tag + '-' + equipments.find((eq: any) => eq.equipment_id === Number(equipmentSelected))?.name,
        position: 'top center'
      },
      equipment_id: equipmentSelected
    }
    console.log('📏 Área delimitada:', polygon)
    console.log('Node Seleccionado:', selectedNode)
    const find = allNodes.find((nod: any) => nod.id === selectedNode?.id)

    let sendObject = {}

    const markers = JSON.parse(find.markers).concat(polygon)

    sendObject = {
      markers: JSON.stringify(markers)
    }
    console.log('info:', sendObject)
    patchPhotogNodeById(Number(selectedNode?.id), sendObject).then((response) => {
      if (response.status === 200) {
        console.log('Polilínea actualizada correctamente')
        setPolygonPoints([])
        setDialogOpen(false)
      } else {
        console.error('Error al actualizar la polilínea:', response)
      }
    }).catch((error) => {
      console.error('Error al actualizar la polilínea:', error)
    })

  }


  return (
    <>
      {
        isNav360 ?
          <div className='w-full h-full relative bg-white' id='container-360'>
            <NavBarInteractives />
            <>
              <ReactPhotoSphereViewer
                ref={pSRef}
                // loadingImg={baseUrl + "loader.gif"}
                touchmoveTwoFingers={true}
                mousewheelCtrlKey={true}
                // navbar={["zoom", "move", "gallery", "download", "description", "caption", "fullscreen"]}
                navbar={false}
                height={"100vh"}
                width={"100%"}
                hideNavbarButton={true}
                onReady={handleReady}
                // onDblclick={(instance: any) => {
                //   setDialogMarkLink({
                //     ...dialogMarkLink,
                //     open: true,
                //     data: {
                //       ...instance.data,
                //       selectedNode: selectedNode
                //     }
                //   })
                // }}
                plugins={plugins}
                container={"container-360"}
                src={selectedNode?.panorama}
              />

              {
                dialogMarkLink.open ? <MarkersLinksDialog setDialogFather={setDialogOpen} allNodes={allNodes} dialogData={dialogMarkLink} setDialogData={setDialogMarkLink} /> : null
              }
              {
                showPanel ?
                  <div className={`absolute max-w-[20%] flex flex-col transition-all duration-500 h-[94%] right-0 top-14 bottom-0 bg-slate-100 z-20 border rounded-l-md`}>

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
                    <div className='flex flex-row justify-between items-center right-0 top-0  bg-[#e9851e] w-full h-[40px] rounded-tl-md'>
                      <p className='text-white ml-2 font-bold'>{'REPORTES DE CONDICIÓN DE EQUIPOS'}</p>
                      <FaWindowClose className='cursor-pointer' onClick={() => { setShowPanel(false) }} size={35} color='white' />
                    </div>

                    {/* <div className='flex flex-row items-center justify-between bg-[#e9851e] p-2'>
                        <h1 className='font-bold text-white'>Reporte de Condición</h1>
                        <button onClick={() => { console.log("Cerrar reporte"), setShowPanel(false) }} >
                            <FaCircleXmark className='text-white' size={25} />
                          </button>
                      </div> */}
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
                              <p className='text-sm'>Fecha: {new Date(obj.created_at).toLocaleDateString()}</p>
                              <p className='text-sm flex flex-row items-center gap-4'>
                                Estado: <FaCircle color={renderColor(generalCondition)} size={30} className='border-2 border-black rounded-full' />
                              </p>
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
                      <div className={`overflow-y-auto transition-all duration-500 ${isOpen ? 'max-h-1/3 opacity-100' : 'max-h-0 opacity-0'}`} >
                        <div className='flex flex-col gap-3 px-7 py-2'>
                          <div className='flex flex-col gap-1 text-black'>
                            <h1 className='font-bold border-b-2 border-black'>Proceso Asociado:</h1>
                            <p>{'parent_data' in (infoEquipment?.entity_data ?? {}) && (infoEquipment?.entity_data as any)?.parent_data?.name ? (infoEquipment?.entity_data as any).parent_data.name : 'Sin proceso asociado'}</p>
                          </div>
                          <div className='flex flex-col gap-1 text-black'>
                            <h1 className='font-bold border-b-2 border-black'>TAG:</h1>
                            <p>{'tag' in (infoEquipment?.entity_data ?? {}) ? (infoEquipment?.entity_data as any).tag : ''}</p>
                          </div>
                          <div className='flex flex-col gap-1 text-black'>
                            <h1 className='font-bold border-b-2 border-black'>Nombre:</h1>
                            <p>{infoEquipment?.entity_data.name}</p>
                          </div>
                          <div className='flex flex-col gap-1 text-black'>
                            <h1 className='font-bold border-b-2 border-black'>Características:</h1>
                            <div>
                              {
                                (infoEquipment !== null && 'properties' in infoEquipment.entity_data && infoEquipment.entity_data.properties) ?
                                  JSON.parse((infoEquipment.entity_data as any).properties)?.filter((obj2: any) => obj2.value !== '')?.map((obj: any, index: number) => {
                                    return (
                                      <div className='flex flex-row justify-between items-center' key={index}>
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
                            <div className='gap-1 flex flex-col overflow-auto h-44'>
                              {
                                infoEquipment?.documents && infoEquipment.documents.length > 0 ? infoEquipment.documents.map((obj: any, index: number) => {
                                  const document = obj.document_id as DocumentStructure
                                  return (
                                    <button key={index} className=' text-black flex flex-row items-center gap-2 p-2 hover:bg-gray-300 rounded-md bg-gray-200' onClick={() => onSetViewDoc(document)}>
                                      <FaFile size={20} />
                                      <p className='text-sm text-start'>{document.title}</p>
                                    </button>
                                  )
                                }) : <p className='text-black'>No hay documentos disponibles</p>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                      <div className={`grid grid-cols-4 gap-1 px-2 text-black items-start ${isOpen2 ? 'max-h-1/3 opacity-100' : 'max-h-0 opacity-0'}`}>
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
                                  <span className='font-bold text-white'>{option.label}</span>
                                </button>
                              </>
                            )
                          })
                        }
                      </div>
                    </div>
                  </div>
                  : null
              }
              <div className={`absolute transition-all duration-500 left-14 bottom-20 flex justify-center items-center w-7 h-7`}>
                <div className='flex justify-center items-center w-full h-full bg-[#ffffff] text-white transition-all duration-300'>
                  <TooltipProvider delayDuration={300} >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => {
                            console.log("Click on button ON");
                            // if (!markersTourPlugin) return;
                            // if (markersVisible) {
                            //   markersTourPlugin.hideMarker("polyline");
                            // } else {
                            //   markersTourPlugin.showMarker("polyline");
                            // }
                            // setMarkersVisible(!markersVisible);
                          }}
                          className={`text-xl p-2 flex items-center justify-center text-black bg-white border-2 border-blue-600 gap-2 rounded-full w-24`}>
                          <h1 className='font-bold'>{'ON'}</h1>
                          <FaCircle size={25} color='green' />
                        </button>
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <OptionsNav />
            </>
            {
              openDialogDoc
                ? <ModalViewMedia setOpen={setOpenDialogDoc} open={openDialogDoc} information={fileSelected} type={'document'} />
                : null
            }
            {
              openViewMedia
                ? <ModalViewMedia setOpen={setOpenViewMedia} open={openViewMedia} information={openMediaInfo} type={openMediaInfo.type} />
                : null
            }
          </div >

          :
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent
              onEscapeKeyDown={(e) => e.preventDefault()}
              onInteractOutside={(e) => e.preventDefault()}
              className='h-full max-w-full pointer-events-auto'>
              <DialogHeader>
                <DialogTitle>{selectedNode?.name}</DialogTitle>
                <DialogDescription />
              </DialogHeader>
              <>
                <div className='relative w-full h-full flex flex-col items-center justify-center'>
                  {
                    polygonPoints.length >= 1
                      ? <div className="absolute top-0 right-0 z-50 bg-gray-200 p-3 rounded-md min-w-[300px]">
                        <div className='flex flex-col gap-2'>
                          <h1 className="text-lg font-bold">ZONA DELIMITADA</h1>
                          <div className="flex flex-col gap-2">
                            <Label>Equipo:</Label>
                            <Select
                              value={equipmentSelected || '0'}
                              onValueChange={(value) => {
                                setEquipmentSelected(value)
                              }
                              }
                              name="name"
                              className="w-full"
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona un nombre" />
                              </SelectTrigger>
                              <SelectContent>
                                {
                                  equipments.map((equipment, index) => (
                                    <SelectItem key={index} value={equipment.equipment_id.toString()}>
                                      {equipment.tag}-{equipment.name}
                                    </SelectItem>
                                  ))
                                }
                              </SelectContent>
                            </Select>
                          </div>
                          <h1 className="text-lg font-bold">Coordenadas:</h1>
                          <div className="flex flex-col gap-2 overflow-auto max-h-[200px]">
                            {
                              polygonPoints.map((point, index) => (
                                <div key={index} className="flex flex-row items-center gap-2">
                                  <div className='flex flex-row items-center'>
                                    <FaCircle className="text-[#687C94]" />
                                    <span className="text-normal font-semibold">P{index}:</span>
                                  </div>
                                  <span className="text-sm">{`[${point[0].toFixed(2)}, ${point[1].toFixed(2)}]`}</span>
                                </div>
                              ))
                            }
                          </div>
                          <div className='flex flex-row gap-2 w-full'>
                            {/* <Button className='w-1/2' onClick={() => { handleSubmitArea() }}>Guardar</Button> */}
                            {/* <Button className='w-1/2' onClick={() => { setPolygonPoints([]) }}>Cancelar</Button> */}
                          </div>
                        </div>
                        <Button className='w-full' onClick={() => { handleSubmitArea() }}>Guardar</Button>
                      </div>
                      : null
                  }

                </div>
                <ReactPhotoSphereViewer
                  ref={pSRef}
                  // loadingImg={baseUrl + "loader.gif"}
                  touchmoveTwoFingers={true}
                  mousewheelCtrlKey={true}
                  navbar={["zoom", "move", "gallery", "download", "description", "caption", "fullscreen"]}
                  height={"93vh"}
                  width={"100%"}
                  hideNavbarButton={true}
                  onReady={handleReady}
                  onClick={handleClick}
                  onDblclick={(instance: any) => {
                    setDialogMarkLink({
                      ...dialogMarkLink,
                      open: true,
                      data: {
                        ...instance.data,
                        selectedNode: selectedNode
                      }
                    })
                  }}
                  plugins={plugins}
                  container={"container-360"}
                  src={selectedNode?.panorama}
                />

                {
                  dialogMarkLink.open ? <MarkersLinksDialog setDialogFather={setDialogOpen} allNodes={allNodes} dialogData={dialogMarkLink} setDialogData={setDialogMarkLink} /> : null
                }
                {
                  showPanel ?
                    <div className={`absolute max-w-[20%] flex flex-col transition-all duration-500 h-[94%] right-0 top-14 bottom-0 bg-slate-100 z-20 border rounded-l-md`}>

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
                      <div className='flex flex-row justify-between items-center right-0 top-0  bg-[#e9851e] w-full h-[40px] rounded-tl-md'>
                        <p className='text-white ml-2 font-bold'>{'REPORTES DE CONDICIÓN DE EQUIPOS'}</p>
                        <FaWindowClose className='cursor-pointer' onClick={() => { setShowPanel(false) }} size={35} color='white' />
                      </div>

                      {/* <div className='flex flex-row items-center justify-between bg-[#e9851e] p-2'>
                        <h1 className='font-bold text-white'>Reporte de Condición</h1>
                        <button onClick={() => { console.log("Cerrar reporte"), setShowPanel(false) }} >
                            <FaCircleXmark className='text-white' size={25} />
                          </button>
                      </div> */}
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
                                <p className='text-sm'>Fecha: {new Date(obj.created_at).toLocaleDateString()}</p>
                                <p className='text-sm flex flex-row items-center gap-4'>
                                  Estado: <FaCircle color={renderColor(generalCondition)} size={30} className='border-2 border-black rounded-full' />
                                </p>
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
                        <div className={`overflow-y-auto transition-all duration-500 ${isOpen ? 'max-h-1/3 opacity-100' : 'max-h-0 opacity-0'}`} >
                          <div className='flex flex-col gap-3 px-7 py-2'>
                            <div className='flex flex-col gap-1 text-black'>
                              <h1 className='font-bold border-b-2 border-black'>Proceso Asociado:</h1>
                              <p>{'parent_data' in (infoEquipment?.entity_data ?? {}) && (infoEquipment?.entity_data as any)?.parent_data?.name ? (infoEquipment?.entity_data as any).parent_data.name : 'Sin proceso asociado'}</p>
                            </div>
                            <div className='flex flex-col gap-1 text-black'>
                              <h1 className='font-bold border-b-2 border-black'>TAG:</h1>
                              <p>{'tag' in (infoEquipment?.entity_data ?? {}) ? (infoEquipment?.entity_data as any).tag : ''}</p>
                            </div>
                            <div className='flex flex-col gap-1 text-black'>
                              <h1 className='font-bold border-b-2 border-black'>Nombre:</h1>
                              <p>{infoEquipment?.entity_data.name}</p>
                            </div>
                            <div className='flex flex-col gap-1 text-black'>
                              <h1 className='font-bold border-b-2 border-black'>Características:</h1>
                              <div>
                                {
                                  (infoEquipment !== null && 'properties' in infoEquipment.entity_data && infoEquipment.entity_data.properties) ?
                                    JSON.parse((infoEquipment.entity_data as any).properties)?.filter((obj2: any) => obj2.value !== '')?.map((obj: any, index: number) => {
                                      return (
                                        <div className='flex flex-row justify-between items-center' key={index}>
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
                              <div className='gap-1 flex flex-col overflow-auto h-44 ml-4'>
                                {
                                  infoEquipment?.documents && infoEquipment.documents.length > 0 ? infoEquipment.documents.map((obj: any, index: number) => {
                                    const document = obj.document_id as DocumentStructure
                                    return (
                                      <button key={index} className=' text-black flex flex-row items-center gap-2 p-1 hover:bg-gray-300 rounded-md bg-gray-200' onClick={() => onSetViewDoc(document)}>
                                        <FaFile size={25} />
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
                        <div className={`grid grid-cols-4 gap-1 px-2 text-black items-start ${isOpen2 ? 'max-h-1/3 opacity-100' : 'max-h-0 opacity-0'}`}>
                          {options.map((option, index) => (
                            <button key={index} className='flex flex-col hover:bg-gray-400 rounded-md items-center justify-center p-2 gap-1'>
                              <Image
                                src={option.url}
                                alt={option.label}
                                width={50}
                                height={50}
                              />
                              <span className='text-xs'>{option.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    : null
                }
                <div className={`absolute transition-all duration-500 left-14 bottom-20 flex justify-center items-center w-7 h-7`}>
                  <div className='flex justify-center items-center w-full h-full bg-[#ffffff] text-white transition-all duration-300'>
                    <TooltipProvider delayDuration={300} >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              console.log("Click on button ON");
                              // if (!markersTourPlugin) return;
                              // if (markersVisible) {
                              //   markersTourPlugin.hideMarker("polyline");
                              // } else {
                              //   markersTourPlugin.showMarker("polyline");
                              // }
                              // setMarkersVisible(!markersVisible);
                            }}
                            className={`text-xl p-2 flex items-center justify-center text-black bg-white border-2 border-blue-600 gap-2 rounded-full w-24`}>
                            <h1 className='font-bold'>{'ON'}</h1>
                            <FaCircle size={25} color='green' />
                          </button>
                        </TooltipTrigger>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

              </>
            </DialogContent>
            {
              openDialogDoc
                ? <ModalViewMedia setOpen={setOpenDialogDoc} open={openDialogDoc} information={fileSelected} type={'document'} />
                : null
            }
            {
              openViewMedia ? <ModalViewMedia open={openViewMedia} setOpen={setOpenViewMedia} information={openMediaInfo} type={openMediaInfo.type} /> : null
            }
          </Dialog >
      }

    </>


  )
}
