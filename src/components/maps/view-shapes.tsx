'use client'
import { getDocumentsByEntity } from '@/api/admin/documents-api'
import { getEntityInfo } from '@/api/admin/entities-api'
import { getMapPlans2dIcons, getShapesByMapId } from '@/api/admin/maps2d-api'
import { getAllShapes } from '@/api/shapes-api'
import { DocumentStructure, IconStructure, Map2dShapesStructure, PhotogrametryStructure, PlanStructure, ShapeStructure, StateInformationStructure, TrouInfoDocDataStructure } from '@/lib/utils'
import { LatLngExpression } from 'leaflet'
import { useParams, useSearchParams } from 'next/navigation'
import React, { use, useEffect, useRef, useState } from 'react'
import { Circle, Marker, Polygon, Popup, Rectangle, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { Icon } from 'leaflet'
import InformationEquipmentComponent from '../interactives/information-eq'
import Node360Viewer from '../admin/nodes360/node360-viewer'
import { getNodes360 } from '@/api/admin/nodes360-api'
import './styles.css'

interface ViewShapesStructure {
  shapesRender: ShapeStructure[] | null
  setShapesRender: (val: ShapeStructure[]) => void
  setSelectedShape: (val: ShapeStructure) => void
  setCloseInformation: (val: boolean) => void
  setRenderLeftInformation: (val: any) => void
  setEquipmentPressed: (val: any) => void
  setEquipmentSelected: (val: any) => void
  showShapes: boolean
  flagRefresh: boolean
  refDivOverflow: any
}

export default function ViewShapes({ setEquipmentSelected, setEquipmentPressed, refDivOverflow, flagRefresh, showShapes, shapesRender, setShapesRender, setSelectedShape, setCloseInformation, setRenderLeftInformation }: ViewShapesStructure) {

  const params = useSearchParams()

  const getShapesAll = async () => {
    try {
      const response = await getShapesByMapId(Number(params.get('map-id')))
      const filteredType = response.data.data.filter((obj) => {
        if (params.get('map-type') === '1' && (obj.marker_type === 1 || obj.marker_type === 5)) {
          return obj
        } else if (params.get('map-type') === '2' && (obj.marker_type === 5)) {
          return obj
        } else if (params.get('map-type') === '3' && (obj.marker_type >= 2 && obj.marker_type <= 4)) {
          return obj
        } else if (params.get('map-type') === '4' && (obj.marker_type === 1 || obj.marker_type === 6)) {
          return obj
        }
      })

      if (response.status === 200) {
        const converted = filteredType.map((obj: Map2dShapesStructure) => {
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

  // console.log("SHAPES RENDERasdasdasd", shapesRender);

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
          iconSize: [50, 50], // size of the icon
          iconAnchor: [15, 20],
          popupAnchor: [-3, -76]
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

  const [selectedMarkerIcon, setSelectedMarkerIcon] = useState<{
    idIcon: number,
    iconUrl: string,
    iconSize: [number, number]
    iconAnchor: [number, number]
    popupAnchor: [number, number]
  }>({
    idIcon: 0,
    iconUrl: '',
    iconSize: [50, 50], // size of the icon
    iconAnchor: [15, 20],
    popupAnchor: [-3, -76]
  })

  const [Open360Dialog, setOpen360Dialog] = useState<boolean>(false)
  const [nodes360, setNodes360] = useState<PhotogrametryStructure[] | null>(null)
  const [nodeSelected, setNodeSelected] = useState<PhotogrametryStructure | null>(null)

  // console.log("MWDHAUIDAW", nodeSelected);

  const getAllNodes = async () => {
    try {
      const response = await getNodes360()
      setNodes360(response.data.data)
    } catch (error) {
      console.log("CONS", error)
    }
  }

  useEffect(() => {
    if (params.get('map-type') === '3') {
      getAllNodes()
    }
  }, [])

  const markerRef = useRef(null);

  function darkenHexColor(hex: string, percent: number): string {
    const num = parseInt(hex?.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const r = Math.max(0, (num >> 16) - amt);
    const g = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const b = Math.max(0, (num & 0x0000FF) - amt);
    return `#${(1 << 24 | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
  }

  return (
    <div>
      {
        shapesRender?.map((obj: ShapeStructure | any, index: number) => {
          const type = obj?.shapes?.type
          const markerType = obj.marker_type
          console.log("OBJ SHAPE", obj)
          const iconShow = mapPlan2dIcon?.find((objIcon) => objIcon.options.idIcon === obj.shape_icon)
          return (

            type === 'circle' ?
              (markerType > 0 && markerType <= 4) && mapPlan2dIcon && showShapes ?
                <Marker
                  // ref={markerRef}
                  eventHandlers={{
                    // mouseover: (e) => {
                    //   console.log("Circulo dentro: ", e)
                    // },
                    // mouseout: (e) => {
                    //   console.log("Circulo fuera: ", e)
                    // },
                    click: (e) => {
                      if (showShapes) {
                        if (markerType === 1 || markerType > 4) {
                          console.log("CIRCLE CLICKED: ", obj)
                          setEquipmentPressed(true)
                          setEquipmentSelected({
                            obj,
                            isVisible: true,
                            position: {
                              x: e.containerPoint.x,
                              y: e.containerPoint.y
                            }
                          })
                        } else {
                          setNodeSelected(obj.photogrammetry_node)
                          setOpen360Dialog(true)
                          setSelectedMarkerIcon(
                            {
                              idIcon: obj.shape_icon,
                              iconUrl: iconShow?.options.iconUrl || '',
                              iconSize: [iconShow?.options.iconSize[0] + 20 || 50, iconShow?.options.iconSize[1] + 20 || 50],
                              iconAnchor: iconShow?.options.iconAnchor || [15, 20],
                              popupAnchor: iconShow?.options.popupAnchor || [-3, -76]
                            }
                          )
                        }
                      }
                    }
                  }}
                  key={index}
                  position={[obj.shapes.coordinates.lat, obj.shapes.coordinates.lng]}
                  icon={iconShow} // Use the selected icon
                >
                  {
                    markerType === 2 ?
                      <Tooltip
                        direction='center'
                        permanent={true}
                        offset={[10, 5]}
                        className='custom-tooltip-front'
                      >
                        <div className='flex flex-row items-end' >
                          <p className='text-xl font-bold'>N</p>
                          <p className=' text-sm text-white font-semibold'>
                            {obj.id}
                          </p>
                        </div>
                      </Tooltip> :
                      markerType === 3 ?
                        <Tooltip
                          direction='center'
                          permanent={true}
                          offset={[10, 5]}
                          className='custom-tooltip-front2'
                        >
                          <div className='flex flex-col items-center -mt-11 gap-2'>
                            <div className='bg-gray-300 p-1 rounded-md shadow-md'>
                              <p className='text-xl font-bold'>{obj.photogrammetry_node.links}</p>
                            </div>
                            <div className='flex flex-row items-end' >
                              <p className='text-xl font-bold'>E</p>
                              <p className=' text-sm text-black font-semibold'>
                                {obj.id}
                              </p>
                            </div>
                          </div>
                        </Tooltip>
                        :
                        null
                  }
                </Marker>
                :
                <Circle
                  key={`circle_${index}`}
                  className={'transition-colors duration-500'}
                  pathOptions={{
                    fillColor: showShapes ? obj.shapes.color : 'transparent',
                    color: showShapes ? darkenHexColor(obj.shapes.color, 20) : 'transparent',
                    fillOpacity: 0.8,
                    weight: 3
                  }}
                  radius={obj.shapes.radius}
                  //    zIndex={10}
                  center={obj.shapes.coordinates as any}
                  eventHandlers={{
                    mouseover: (e) => {
                      if (showShapes) {
                        e.target.setStyle({
                          weight: 5,
                          color: darkenHexColor(obj.shapes.color, 20),
                          fillOpacity: 1,
                        })
                      }
                    },
                    mouseout: (e) => {
                      if (showShapes) {
                        e.target.setStyle({
                          weight: 3,
                          color: darkenHexColor(obj.shapes.color, 20),
                          fillOpacity: 0.8,
                        })
                      }
                    },
                    click: async (e) => {
                      console.log("Click circle: ", e)
                      if (showShapes && markerType === 1) {
                        e.target.setStyle({
                          weight: 5,
                          color: obj.shapes.color,
                          fillOpacity: 1,
                        });
                      }
                      if (showShapes) {
                        await getDataInfoShape(obj)
                        setSelectedShape(obj)
                        setCloseInformation(false)
                      }
                    }
                  }}>

                  <Tooltip direction='top' offset={[2, -20]}>
                    <p className='text-base font-semibold text-gray-800'>
                      {obj.entity_id?.name || obj.photogrammetry_node?.name}
                    </p>
                  </Tooltip>
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
      {
        Open360Dialog ?
          <Node360Viewer selectedNode={nodeSelected} allNodes={nodes360} dialogOpen={Open360Dialog} setDialogOpen={setOpen360Dialog} />
          : null
      }
    </div>


  )
}
