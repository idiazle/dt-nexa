"use client"
import React, { useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, ImageOverlay, FeatureGroup, useMapEvents } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from 'leaflet';
import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { PlanStructure, ShapeStructure } from '@/lib/utils';
import { bounds, centerLat, centerLng, maxBounds } from './static-data';
import { AspectRatio } from '../ui/aspect-ratio';
import { useSession } from 'next-auth/react';
import { EditControl } from "react-leaflet-draw"
import { Button } from '../ui/button';
import { TbTriangleSquareCircleFilled } from "react-icons/tb";
import { FaSquareMinus, FaSquarePlus } from "react-icons/fa6";
import ShapesPlanDialog from '../admin/plans/shapes-plan-dialog';
import { EyeClosedIcon } from '@radix-ui/react-icons';
import { EyeIcon } from 'lucide-react';
import ViewShapes from './view-shapes';
import { getDocumentsByEntity } from '@/api/admin/documents-api';

interface MapProps {
    planSelected: PlanStructure | null
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
    const { zoom = defaults.zoom, posix } = Map
    const [shapesRender, setShapesRender] = useState<ShapeStructure[] | null>([])
    const [selectedShape, setSelectedShape] = useState<ShapeStructure | null>(null)
    const { data: session } = useSession()

    const [openShapeDialog, setopenShapeDialog] = useState<boolean>(false)

    const [planShape, setPlanShape] = useState<ShapeStructure | null>(null)

    const admin = session?.user?.groups.find((obj: any) => obj === 1 || obj === 3)
    const refFeature = useRef<any>()

    const _onCreate = (e: any) => {
        console.log("ON CREATEEE111", e);
        // console.log("ON CREATEEE222", e.layer._latlngs);

        if (e.layer._latlngs || e.layer._latlng) {
            const objShape = {
                type: String(e.layerType),
                coordinates: e.layer._latlng || e.layer._latlngs
            }

            if (objShape) {
                setPlanShape({
                    ...planShape as ShapeStructure,
                    shapes: objShape as any,
                    plan_id: Number(Map.planSelected?.id)
                })
            }
            setopenShapeDialog(true)
            // setSendShapes({ ...sendShapes, shapes: objShape })
            // addShapeModalDisc.onOpen()
            // setOpenAddShape(true)
        }
    }

    const _onEditPath = (e: any) => {
        console.log("on first", e);

    }

    const _onDelete = (e: any) => {
        // setShapesRender((prevstate)=>prevstate?.map((obj)=>{
        //     if(obj.shapes.shape_id_on_map === ){

        //     }
        // }))
        console.log("on dele222", e);
    }

    const initialStateMenuBtns: MenuBtns[] = [
        {
            id: 1,
            show_name: 'Mostrar formas',
            hide_name: 'Ocultar formas',
            icon: <TbTriangleSquareCircleFilled size={25} />,
            active: true
        },
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

    const getDataInfoShape = async () =>{
        try {
            const response = await getDocumentsByEntity()
        } catch (error) {
            return null
        }
    }

console.log(selectedShape);


    return (
        <div className='flex flex-col w-full h-full'>
            <div className='relative w-full h-full'>
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
                        url={String(Map.planSelected?.image)}
                    />

                    {
                        admin !== undefined && actionMenuBtns[1].active ?
                            <FeatureGroup ref={refFeature}>
                                <EditControl
                                    edit={{
                                        edit: false,
                                        remove: false
                                    }}

                                    position='bottomright'
                                    onCreated={_onCreate}
                                    // onEdited={_onEditPath}
                                    onDeleted={_onDelete}
                                    draw={{
                                        polyline: false,
                                        polygon: true,
                                        circle: true,
                                        circlemarker: false,
                                        rectangle: false,
                                        marker: false
                                    }}
                                />
                                <ViewShapes setSelectedShape={setSelectedShape} shapesRender={shapesRender} setShapesRender={setShapesRender} />
                            </FeatureGroup> : null
                    }
                </MapContainer>
            </div>

            {/* TOP MENU CONTROL */}
            <div className={`absolute transition-all duration-500 m-auto left-0 right-0 flex justify-center items-center ${!controlMinimized ? 'h-[65px] opacity-100' : 'h-0 opacity-0'} w-1/3`}>
                <div className='flex justify-center items-center w-full h-full bg-[#030F2E] text-white transition-all duration-300 rounded-b'>
                    <FaSquareMinus size={20} className='absolute right-0 top-0 hover:cursor-pointer' onClick={() => { setControlMinimized(true) }} />
                    {
                        actionMenuBtns.map((obj) => {
                            return (
                                <Button key={obj.id} className='h-full w-full' size={'icon'} variant={'outline'} onClick={() => handleClickBtn(obj)}>
                                    <div className='flex flex-col justify-center items-center'>
                                        <div className='flex flex-row justify-center items-center gap-3'>
                                            {obj.icon}
                                            {obj.active ? <EyeIcon /> : <EyeClosedIcon />}
                                        </div>
                                        {/* <EyeIcon/> */}
                                        <p className='text-xs'>{!obj.active ? obj.show_name : obj.hide_name}</p>
                                    </div>
                                </Button>
                            )
                        })
                    }

                </div>
            </div>

            {/* LEFT DATA INFORMATION SHOW */}
            <div className={`absolute transition-all duration-700 h-5/6 left-0 m-auto top-0 bottom-0 ${selectedShape !== null ? 'w-1/4 opacity-100' : 'w-0 opacity-0'} bg-slate-200 z-50 rounded-r border`}>

            </div>

            {
                controlMinimized ? <FaSquarePlus onClick={() => { setControlMinimized(false) }} className='absolute top-0 right-0' size={30} color='black' /> : null
            }
            {
                openShapeDialog ? <ShapesPlanDialog dialogOpen={openShapeDialog} setDialogOpen={setopenShapeDialog} planShape={planShape} setPlanShape={setPlanShape} /> : null
            }

        </div>
    )
}
