'use client'
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EntityStructure, EquipmentStructure, IconStructure, Map2dShapesStructure, MenuIconsStructure, PhotogrametryStructure, PlanStructure, ShapeStructure } from '@/lib/utils'
import { getEntities } from '@/api/admin/entities-api'
import { getEquipments } from '@/api/admin/equipments-api'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { postShapes } from '@/api/shapes-api'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from 'lucide-react'
import { HexColorPicker } from "react-colorful";
import { getNodes360 } from '@/api/admin/nodes360-api'
import ComboNodes from '../nodes360/combo-nodes'
import { useParams, useSearchParams } from 'next/navigation'
import { Switch } from '@/components/ui/switch'
import { getMapPlans2dIcons, postMapsShapes2d } from '@/api/admin/maps2d-api'
import Image from 'next/image'

interface ShapesPlanDialogStructure {
  planShape: ShapeStructure | null
  setPlanShape: (value: ShapeStructure) => void
  dialogOpen: boolean
  setDialogOpen: (value: boolean) => void
  setFlagRefresh: (value: any) => void
}


export default function ShapesPlanDialog({ setFlagRefresh, planShape, setPlanShape, dialogOpen, setDialogOpen }: ShapesPlanDialogStructure) {

  const [radioSelected, setRadioSelected] = useState<string>('areas')

  const [areas, setAreas] = useState<EntityStructure[] | null>(null)
  const [equipments, setEquipments] = useState<EquipmentStructure[] | null>(null)
  const [nodes360, setNodes360] = useState<PhotogrametryStructure[] | null>(null)
  const [map2dIcons, setMap2dIcons] = useState<IconStructure[] | null>(null)

  const getAllAreas = async () => {
    try {
      const response = await getEntities()
      if (response.status === 200) {
        const areas = response.data.data.filter((area) => area.type === 5)
        setAreas(areas)
      }
    } catch (error) {
      throw new Error('Error in getAreas - dialog-add-shape component')
    }
  }
  const getAllEquipments = async () => {
    try {
      const response = await getEquipments()
      if (response.status === 200) {
        setEquipments(response.data.data)
      }
    } catch (error) {
      throw new Error('Error in getEquipments - dialog-add-shape component')
    }
  }
  const getAll360Nodes = async () => {
    try {
      const response = await getNodes360()
      if (response.status === 200) {
        setNodes360(response.data.data)
      }
    } catch (error) {
      throw new Error('Error in getEquipments - dialog-add-shape component')
    }
  }

  const getAllIcons = async () => {
    try {
      const response = await getMapPlans2dIcons()
      console.log("allicons", response.data.data);

      if (response.status === 200) {
        setMap2dIcons(response.data.data)
      }
    } catch (error) {
      throw new Error('Error in getEquipments - dialog-add-shape component')
    }
  }


  useEffect(() => {
    getAllAreas()
    getAllEquipments()
    getAll360Nodes()
    getAllIcons()
  }, [])
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<string>("")



  const renderOption = (arrayRender: EntityStructure[] | EquipmentStructure[], tag: string) => {

    return (
      <div className='w-full'>
        {
          arrayRender != null
            ? arrayRender.length > 0
              ?
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {value
                      ? arrayRender.find((framework: any) => String(tag === 'area' ? framework.id : framework.equipment_id) === value)?.name
                      : `Seleccione el ${tag}`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="CustomPopoverContent">
                  <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {arrayRender.map((framework: any) => (
                          <CommandItem
                            key={tag === 'area' ? framework.id : framework.equipment_id}
                            value={String(tag === 'area' ? framework.id : framework.equipment_id)}
                            keywords={[framework.name]}
                            onSelect={(currentValue) => {
                              const shapeType = tag === 'equipo' ? '2' : '1'
                              setPlanShape({ ...planShape as ShapeStructure, shape_type: shapeType, entity_id: Number(currentValue) })

                              setValue(currentValue === value ? "" : currentValue)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === String(tag === 'area' ? framework.id : framework.equipment_id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {framework.tag} - {framework.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              : <h1>No existen {tag}s</h1>
            : <div className='flex items-center justify-center'>
              <Skeleton className="h-4 w-[250px]" />
            </div>

        }
      </div>
    )
  }
  const { toast } = useToast()

  const [markerType, setMarkerType] = useState('')
  const initialLinkData = {
    nodeId: '',
    position: { textureX: 0, textureY: 0 }
  }

  const [linkData, setLinkData] = useState<{
    nodeId: string
    position: { textureX: number, textureY: number }
  } | null>(initialLinkData)
  const [iconSelected, setIconSelected] = useState('')

  const [switchObject, setSwitchObject] = useState({
    option1: false,
    option2: false
  })

  const renterOptionType = () => {

    if (markerType === '1') {
      return (
        <div className='flex flex-col gap-3'>
          {/* <h1>Qué desea vincular?</h1> */}
          <RadioGroup value={radioSelected} onValueChange={(val) => {
            setRadioSelected(val)
            setValue('')
          }} className='flex flex-row items-center gap-5' defaultValue="areas">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="areas" id="areas" />
              <Label htmlFor="areas">Áreas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="equipos" id="equipos" />
              <Label htmlFor="equipos">Equipos</Label>
            </div>
          </RadioGroup>
          {
            areas !== null && equipments !== null
              ?
              <div>
                <div className='flex flex-row w-full justify-center items-center gap-3'>
                  {
                    radioSelected === 'areas' ? renderOption(areas, 'area') : renderOption(equipments, 'equipo')
                  }
                  <div className='flex flex-row justify-center items-center gap-2'>
                    <Label>Icono</Label>
                    <Switch checked={switchObject.option1} onCheckedChange={(val) => {
                      setSwitchObject({
                        ...switchObject,
                        option1: val
                      })
                    }} />
                  </div>
                </div>
                {
                  switchObject.option1 ?
                    <div className='flex flex-row justify-center items-center gap-3'>
                      <Select value={iconSelected} onValueChange={(val) => setIconSelected(val)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Elija el ícono" />
                        </SelectTrigger>
                        <SelectContent>
                          {
                            map2dIcons?.map((obj) => {
                              return (
                                <SelectItem key={obj.id} value={String(obj.id)}>{obj.name}</SelectItem>
                              )
                            })
                          }</SelectContent>
                      </Select>
                      {
                        iconSelected !== '' ?
                          <Image
                            alt={map2dIcons?.find((obj) => obj.id === Number(iconSelected))?.name ?? ''}
                            src={map2dIcons?.find((obj) => obj.id === Number(iconSelected))?.file ?? ''}
                            width={30}
                            height={30}
                          /> : null
                      }
                    </div> :
                    <div className='flex flex-col justify-center items-start gap-1 my-2'>
                      <Label>Color del Shape</Label>
                      <Popover>
                        <PopoverTrigger asChild>

                          <Button style={{
                            backgroundColor: planShape?.shapes.color
                          }} variant="outline" className={`w-full h-[40px]`} />

                        </PopoverTrigger>
                        <PopoverContent>
                          <HexColorPicker color={planShape?.shapes.color as any} onChange={(va) => {
                            setPlanShape({
                              ...planShape as ShapeStructure,
                              shapes: {
                                ...planShape?.shapes as {},
                                color: va
                              } as any
                            })
                          }} />
                        </PopoverContent>
                      </Popover>
                    </div>
                }
              </div>
              : null
          }


        </div>
      )
    } else if ((markerType === '2' || markerType === '3' || markerType === '4') && nodes360 !== null) {
      return (
        <div className='flex flex-col justify-center items-center gap-4 w-full'>
          <div className='flex flex-col w-full'>
            <Label>Nodo de referencia</Label>
            <ComboNodes data={nodes360} linkData={linkData} setLinkData={setLinkData} />
          </div>
          <div className='flex flex-col w-full'>
            <Label>Ícono del shape</Label>
            <div className='flex flex-row justify-center items-center gap-3 w-full'>
              <Select value={iconSelected} onValueChange={(val) => setIconSelected(val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Elija el ícono" />
                </SelectTrigger>
                <SelectContent>
                  {
                    map2dIcons?.map((obj) => {
                      return (
                        <SelectItem key={obj.id} value={String(obj.id)}>{obj.name}</SelectItem>
                      )
                    })
                  }</SelectContent>
              </Select>
              {
                iconSelected !== '' ?
                  <Image
                    alt={map2dIcons?.find((obj) => obj.id === Number(iconSelected))?.name ?? ''}
                    src={map2dIcons?.find((obj) => obj.id === Number(iconSelected))?.file ?? ''}
                    width={30}
                    height={30}
                  /> : null
              }
            </div>
          </div>
        </div>
      )
    }
    else if (markerType === '5' && equipments !== null) {
      return (
        <div>
          <Label>Equipo</Label>

          <div className='flex flex-row justify-center items-center gap-2'>
            {
              renderOption(equipments, 'equipo')
            }
            <Popover>
              <PopoverTrigger asChild>

                <Button style={{
                  backgroundColor: planShape?.shapes.color
                }} variant="outline" className={`w-[40px] h-[40px]`} />

              </PopoverTrigger>
              <PopoverContent>
                <HexColorPicker color={planShape?.shapes.color as any} onChange={(va) => {
                  setPlanShape({
                    ...planShape as ShapeStructure,
                    shapes: {
                      ...planShape?.shapes as {},
                      color: va
                    } as any
                  })
                }} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

      )
    }
  }


  const postSaveShape = async () => {

    if (planShape) {
      const finalSend: Map2dShapesStructure = {
        shapes: JSON.stringify(planShape.shapes) as any,
        entity: planShape.entity_id,
        mapplan2d: planShape.plan_id,
        marker_type: Number(markerType),
        photogrammetry_node: linkData?.nodeId !== '' ? Number(linkData?.nodeId) : null,
        shape_icon: iconSelected !== '' ? Number(iconSelected) : null

      }
      // console.log('finalsend', finalSend);

      try {

        const response = await postMapsShapes2d(finalSend)
        if (response.status === 201) {
          toast({
            duration: 3000,
            variant: 'default',
            title: 'Creación',
            description: 'Shape creado correctamente'
          })
          setDialogOpen(false)
          setFlagRefresh((prev: boolean) => !prev)
        }
      } catch (error) {
        throw new Error('Error in postSaveShape - dialog-add-shape component')
      }
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader className=''>
          <DialogTitle>Creación de Shape</DialogTitle>
          <DialogDescription>
            Qué tipo de vinculación desea realizar?
          </DialogDescription>
        </DialogHeader>

        <Select onValueChange={(val) => {
          setMarkerType(val), setIconSelected(''), setLinkData(initialLinkData)
          setValue('')
          setPlanShape({
            ...planShape as ShapeStructure,
            entity_id: null
          })
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Elija una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Información (2d)</SelectItem>
            <SelectItem value="2">Punto de Navegación (360)</SelectItem>
            <SelectItem value="3">Punto de Equipo (360)</SelectItem>
            <SelectItem value="4">Punto Auxiliar (360)</SelectItem>
            <SelectItem value="5">Condición de Equipo (2d)</SelectItem>
            <SelectItem value="6">Otro</SelectItem>
          </SelectContent>
        </Select>

        {
          markerType === '' ? null :
            renterOptionType()
        }
        <DialogFooter>
          <Button type="button" onClick={() => { postSaveShape() }}>Guardar</Button>
          <Button type="button" onClick={() => { setDialogOpen(false) }}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
