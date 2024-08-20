'use client'
import { getAllShapes } from '@/api/shapes-api'
import { ShapeStructure } from '@/lib/utils'
import { LatLngExpression } from 'leaflet'
import React, { useEffect, useState } from 'react'
import { Circle, Polygon } from 'react-leaflet'


interface ViewShapesStructure {
    shapesRender: ShapeStructure[] | null
    setShapesRender: (val: ShapeStructure[]) => void
    setSelectedShape: (val: ShapeStructure) => void
}

export default function ViewShapes({ shapesRender, setShapesRender, setSelectedShape }: ViewShapesStructure) {
    const getShapesAll = async () => {
        try {
            const response = await getAllShapes()
            console.log(response.data.data);
            
            if (response.status === 200) {
                const converted = response.data.data.map((obj: any) => {
                    return {
                        id: obj.id,
                        entity_id: obj.entity_id,
                        entity_type: obj.entity_type,
                        shape_type:obj.shape_type,
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
    }, [])

    return (

        shapesRender?.map((obj: ShapeStructure | any, index: number) => {
            const type = obj?.shapes?.type
            return (
                type === 'circle' ?
                    <Circle
                        key={`circle_${index}`}
                        className={'transition-colors duration-1000'}
                        pathOptions={{ fillColor: obj.shapes.color, color: obj.shapes.color, fillOpacity: 0.6, weight: 0.5 }}
                        radius={10}
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
                            click: (e) => {
                                console.log("Clickeed circle: ", e)
                                console.log("Clickeed circle OBJECT: ", obj)
                                setSelectedShape(obj)
                            }
                        }}>
                    </Circle>
                    : type === 'polygon' ?
                        <Polygon
                            key={`polygon_${index}`}
                            smoothFactor={1}
                            lineJoin={'round'}
                            lineCap={'round'}
                            pathOptions={{ color: obj.shapes.color, fillColor: obj.shapes.color, opacity: 1, weight: 1.5, dashArray: '4' }}
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
                                click: (e) => {
                                    console.log("Click polygon: ", e)
                                    setSelectedShape(obj)
                                }
                            }}
                        >
                            {/* <Popup >
                             <div className="flex flex-row justify-between">
                               <div className="text-base font-semibold">{shape.shapes.name}</div>
                             </div>
                           </Popup> */}

                        </Polygon>
                        : null
            )
        })

    )
}
