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
    SelectValue
} from '@/components/ui/select'
import { EntityStructure, EquipmentStructure, PlanStructure, ShapeStructure } from '@/lib/utils'
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

interface ShapesPlanDialogStructure {
    planShape: ShapeStructure | null
    setPlanShape: (value: ShapeStructure) => void
    dialogOpen: boolean
    setDialogOpen: (value: boolean) => void
}


export default function ShapesPlanDialog({ planShape, setPlanShape, dialogOpen, setDialogOpen }: ShapesPlanDialogStructure) {
    const [radioSelected, setRadioSelected] = useState<string>('areas')

    const [areas, setAreas] = useState<EntityStructure[] | null>(null)
    const [equipments, setEquipments] = useState<EquipmentStructure[] | null>(null)

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
    useEffect(() => {
        getAllAreas()
        getAllEquipments()
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
                                                        {framework.name}
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



    const postSaveShape = async () => {

        if (planShape) {
            const finalSend: ShapeStructure = {
                shapes: JSON.stringify(planShape.shapes) as any,
                entity_id: planShape.entity_id,
                shape_type: planShape.shape_type,
                plan_id: planShape.plan_id
            }
            console.log('finalsend', finalSend);

            try {

                const response = await postShapes(finalSend)
                if (response.status === 201) {
                    toast({
                        duration: 3000,
                        variant: 'default',
                        title: 'Creación',
                        description: 'Shape creado correctamente'
                    })
                    setDialogOpen(false)
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
                <div className='flex flex-col gap-3'>
                    {/* <h1>Qué desea vincular?</h1> */}
                    <RadioGroup value={radioSelected} onValueChange={(val) => {
                        console.log(val);
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
                            <div className='flex flex-row w-full justify-center items-center gap-3'>
                                {
                                    radioSelected === 'areas' ? renderOption(areas, 'area') : renderOption(equipments, 'equipo')
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
                            : null
                    }


                </div>
                <DialogFooter>
                    <Button disabled={value === ''} type="button" onClick={() => { postSaveShape() }}>Guardar</Button>
                    <Button type="button" onClick={() => { setDialogOpen(false) }}>Cancelar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
