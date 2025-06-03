'use client'
import { getDocumentsByEntity } from '@/api/admin/documents-api'
import { getEntityInfo } from '@/api/admin/entities-api'
import { getMapPlans2dIcons, getShapesByMapId } from '@/api/admin/maps2d-api'
import { getAllShapes } from '@/api/shapes-api'
import { DocumentStructure, IconStructure, Map2dShapesStructure, PlanStructure, ShapeStructure } from '@/lib/utils'
import { LatLngExpression } from 'leaflet'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Circle, Marker, Polygon, Rectangle } from 'react-leaflet'

import { Icon } from 'leaflet'

interface ViewShapesStructure {
    shapesRender: Map2dShapesStructure[] | null
    setShapesRender: (val: ShapeStructure[]) => void
    setSelectedShape: (val: ShapeStructure) => void
    setCloseInformation: (val: boolean) => void
    setRenderLeftInformation: (val: any) => void
    showShapes: boolean
    flagRefresh: boolean
}

export default function ViewShapes({ flagRefresh, showShapes, shapesRender, setShapesRender, setSelectedShape, setCloseInformation, setRenderLeftInformation }: ViewShapesStructure) {

    const params = useSearchParams()

    const getShapesAll = async () => {
        try {
            const response = await getShapesByMapId(Number(params.get('map-id')))
            console.log("MY SHAPRES", response.data.data);

            if (response.status === 200) {
                const converted = response.data.data.map((obj: Map2dShapesStructure) => {
                    return {
                        id: obj.id,
                        entity_id: obj.entity,
                        // entity_type: obj.entity_type,
                        marker_type: obj.marker_type,
                        shape_icon: obj.shape_icon,
                        photogrammetry_node: obj.photogrammetry_node,
                        shapes: JSON.parse(obj.shapes)
                    }
                })
                setShapesRender(converted as any[])
            }
        } catch (error) {
            throw new Error('Error when getShapesALl in ViewShapesMap component')
        }
    }

    useEffect(() => {
        getShapesAll()
    }, [flagRefresh])

    const getDataInfoShape = async (shapeSelected: ShapeStructure) => {
        try {
            const responseEntity = await getEntityInfo(Number(shapeSelected?.entity_id))
            const response = await getDocumentsByEntity(Number(shapeSelected?.entity_id), Number(shapeSelected?.entity_type))
            setRenderLeftInformation((prevstate: any) => {
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

    const [mapPlan2dIcon, setMapPlan2dIcon] = useState<any[] | null>(null)

    const getAllIcons = async () => {
        try {
            const response = await getMapPlans2dIcons()
            const iconsRender = response.data.data.map((obj) => {
                const newIccon = new Icon({
                    idIcon: obj.id,
                    iconUrl: obj.file,
                    iconSize: [35, 35], // size of the icon
                    iconAnchor: [15, 20], // point of the icon which will correspond to marker's location
                    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
                })
                return newIccon
            })
            console.log("MY UCOIBSS", iconsRender);

            setMapPlan2dIcon(iconsRender)
        } catch (error) {
            console.log("ERR", error)
        }
    }

    useEffect(() => {
        getAllIcons()
    }, [])



    return (
        <div>
            {
                shapesRender?.map((obj: ShapeStructure | any, index: number) => {
                    const type = obj?.shapes?.type
                    const markerType = obj.marker_type
                    const iconShow = mapPlan2dIcon?.find((objIcon) => objIcon.options.idIcon === obj.shape_icon)


                    return (

                        type === 'circle' ?
                            (markerType > 0 && markerType <= 4) && mapPlan2dIcon ?
                                <Marker
                                    key={index}
                                    position={[obj.shapes.coordinates.lat, obj.shapes.coordinates.lng]}
                                    icon={iconShow} // Use the selected icon
                                />
                                :
                                <Circle
                                    key={`circle_${index}`}
                                    className={'transition-colors duration-500'}
                                    pathOptions={{ fillColor: showShapes ? obj.shapes.color : 'transparent', color: showShapes ? obj.shapes.color : 'transparent', fillOpacity: 0.6, weight: 0.5 }}
                                    radius={obj.shapes.radius}
                                    //    zIndex={10}
                                    center={obj.shapes.coordinates as any}
                                    eventHandlers={{
                                        mouseover: (e) => {
                                            // console.log("Circulo dentro: ", e)
                                            e.target.openPopup()
                                        },
                                        mouseout: (e) => {
                                            // console.log("Poligono fuera: ", e)
                                            e.target.closePopup()
                                        },
                                        click: async (e) => {
                                            // console.log("Clickeed circle: ", e)
                                            // console.log("Clickeed circle OBJECT: ", obj)
                                            if (showShapes) {
                                                await getDataInfoShape(obj)
                                                setSelectedShape(obj)
                                                setCloseInformation(false)
                                            }
                                        }
                                    }}>
                                </Circle>
                            : type === 'polygon' ?
                                <Polygon
                                    key={`polygon_${index}`}
                                    smoothFactor={1}
                                    lineJoin={'round'}
                                    lineCap={'round'}
                                    className='transition-colors duration-500'
                                    pathOptions={{ fillColor: showShapes ? obj.shapes.color : 'transparent', color: showShapes ? obj.shapes.color : 'transparent', fillOpacity: 0.6, weight: 1.5, dashArray: '4' }}
                                    //  pathOptions={{ color: 'red' }}
                                    opacity={0.1}
                                    //    zIndex={1}
                                    positions={obj.shapes.coordinates}
                                    eventHandlers={{
                                        mouseover: (e) => {
                                            // console.log("Poligono dentro: ", e)
                                            e.target.openPopup()
                                        },
                                        mouseout: (e) => {
                                            // console.log("Poligono fuera: ", e)
                                            e.target.closePopup()
                                        },
                                        click: async (e) => {
                                            // console.log("Click polygon: ", e)
                                            if (showShapes) {
                                                await getDataInfoShape(obj)
                                                setSelectedShape(obj)
                                                setCloseInformation(false)
                                            }

                                        }
                                    }}
                                >
                                    {/* <Popup >
                             <div className="flex flex-row justify-between">
                               <div className="text-base font-semibold">{shape.shapes.name}</div>
                             </div>
                           </Popup> */}

                                </Polygon>
                                : type === 'rectangle' ?
                                    <Rectangle
                                        key={`rectangle_${index}`}
                                        className='transition-colors duration-500'
                                        pathOptions={{ fillColor: showShapes ? obj.shapes.color : 'transparent', color: showShapes ? obj.shapes.color : 'transparent', fillOpacity: 0.6, weight: 1.5, dashArray: '4' }}
                                        eventHandlers={{
                                            click: async () => {
                                                if (showShapes) {
                                                    await getDataInfoShape(obj)
                                                    setSelectedShape(obj)
                                                    setCloseInformation(false)
                                                }
                                            }
                                        }}
                                        bounds={obj.shapes.coordinates}
                                    />
                                    : null
                    )
                })
            }
            {/* Aquí va el dialog de información */}
            {/* Aquí va el dialog del 360 */}

        </div>


    )
}
