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
import { FaAngleDown, FaAngleUp, FaCircleXmark } from 'react-icons/fa6';
import { FanIcon } from 'lucide-react';
import Image from 'next/image';

interface Nodes360ViewerStructure {
  allNodes: PhotogrametryStructure[] | null
  selectedNode: PhotogrametryStructure | null
  dialogOpen: boolean
  setDialogOpen: (val: boolean) => void
}

const baseUrl = "https://photo-sphere-viewer-data.netlify.app/assets/";
const caption = "Cape Florida Light, Key Biscayne <b>&copy; Pixexid</b>";

export default function Node360Viewer({ allNodes, selectedNode, dialogOpen, setDialogOpen }: Nodes360ViewerStructure) {

  const pSRef = React.createRef();
  const [getCurrentNodeFunction, setGetCurrentNodeFunction] = React.useState(null);

  const handleReady = (instance) => {
    const virtualTour = instance.getPlugin(VirtualTourPlugin);
    if (!virtualTour) return;

    if (allNodes !== null && selectedNode !== null) {
      virtualTour.setNodes(
        allNodes.map((obj) => {
          return {
            ...obj,
            links: JSON.parse(obj.links as string),
            markers: JSON.parse(obj.markers as string).map((mark: any, index: number) => {
              return {
                ...mark,
                id: mark.tooltip + index
              }
            })
          }
        })
        ,
        selectedNode.id
      )
      console.log("MY ALL NNNNNNOOODES", allNodes);
    }


  };

  const handleClick = () => {
    const curr_node = getCurrentNodeFunction();
    console.log(curr_node);
  }

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

  const [dialogMarkLink, setDialogMarkLink] = useState({
    open: false,
    data: null
  })

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [showPanel, setShowPanel] = useState<boolean>(true);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className='max-h-full max-w-full'>
        <DialogHeader>
          <DialogTitle>{selectedNode?.name}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <>
          <ReactPhotoSphereViewer
            ref={pSRef}
            // loadingImg={baseUrl + "loader.gif"}
            touchmoveTwoFingers={true}
            mousewheelCtrlKey={true}
            navbar={["zoom", "move", "gallery", "download", "description", "caption", "fullscreen"]}
            height={"85vh"}
            width={"100%"}
            hideNavbarButton={true}
            onReady={handleReady}
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
              <div className={`absolute z-50 flex flex-col gap-2 top-14 right-0 w-96 h-[93%] bg-white rounded-l-md `}>
                <div className='flex flex-row items-center justify-between bg-gray-500 p-2'>
                  <h1 className='font-bold text-white'>Reporte de Condición</h1>
                  <button onClick={() => { console.log("Cerrar reporte"), setShowPanel(false) }} >
                    <FaCircleXmark className='text-white' size={25} />
                  </button>
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
                        <p>B-2016</p>
                      </div>
                      <div className='flex flex-col gap-1 text-black'>
                        <h1 className='font-bold border-b-2 border-black'>Nombre:</h1>
                        <p>Soplador</p>
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
              : null
          }
        </>
      </DialogContent>
    </Dialog>
  )
}
