'use client'
import { getDocumentsByEntity } from '@/api/admin/documents-api'
import { getEntityInfo } from '@/api/admin/entities-api'
import { getAllShapes } from '@/api/shapes-api'
import { DocumentStructure, PlanStructure, ShapeStructure } from '@/lib/utils'
import { LatLngExpression } from 'leaflet'
import React, { useEffect, useState } from 'react'
import { Circle, Polygon, Rectangle } from 'react-leaflet'


interface ViewShapesStructure {
    shapesRender: ShapeStructure[] | null
    setShapesRender: (val: ShapeStructure[]) => void
    setSelectedShape: (val: ShapeStructure) => void
    setCloseInformation: (val: boolean) => void
    setRenderLeftInformation: (val: any) => void
    showShapes: boolean
    flagRefresh: boolean
}

export default function ViewShapes({ flagRefresh, showShapes, shapesRender, setShapesRender, setSelectedShape, setCloseInformation, setRenderLeftInformation }: ViewShapesStructure) {
    const getShapesAll = async () => {
        try {
            const response = await getAllShapes()
            if (response.status === 200) {
                const converted = response.data.data.map((obj: any) => {
                    return {
                        id: obj.id,
                        entity_id: obj.entity_id,
                        entity_type: obj.entity_type,
                        shape_type: obj.shape_type,
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

    return (

        shapesRender?.map((obj: ShapeStructure | any, index: number) => {
            const type = obj?.shapes?.type

            return (
                type === 'circle' ?
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

    )
}
