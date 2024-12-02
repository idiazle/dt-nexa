import { getEntityById } from '@/api/admin/entities-api'
import { OptionAsideContext } from '@/context/option-aside-context'
import { EntityStructure } from '@/lib/utils'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { FaDiceD6 } from 'react-icons/fa6'
import { DataTable } from '@/app/user/data-table'
import { columns, Payment } from '@/app/user/columns-table'
import { getDocsByAreaByEq, getDocumentsByArea } from '@/api/admin/documents-api'
import DocumentsTable from '@/app/admin/documents/documents-table'
import { getEquipmentsByEntityId } from '@/api/admin/equipments-api'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { Card, CardContent } from '../ui/card'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function UserAreaContainer() {

    const { option } = useContext(OptionAsideContext)
    const [areaInfo, setAreaInfo] = useState<EntityStructure | null>(null)



    const getAreaInfo = async () => {
        setAreaInfo(null)
        try {
            const response = await getEntityById(option.id)
            const respEdited: EntityStructure = {
                ...response.data.data,
                children: response.data.data.children.map((obj) => {
                    return {
                        ...obj,
                        isSelected: false
                    }
                })
            }

            setAreaInfo(respEdited)

        } catch (error) {
            return null
        }

    }

    useEffect(() => {
        getAreaInfo()
    }, [option])

    const initialOptionsArray = [
        {
            id: 1,
            name: 'Planta Virtual',
            isSelected: false,
            disabled: true
        },
        {
            id: 2,
            name: 'Documentos Generales',
            isSelected: false,
            disabled: false
        },
        {
            id: 3,
            name: 'Equipos de Proceso',
            isSelected: false,
            disabled: false
        },
        {
            id: 4,
            name: 'Planos Interactivos P&ID',
            isSelected: false,
            disabled: true
        },
        {
            id: 5,
            name: 'Planos de Proceso',
            isSelected: false,
            disabled: true
        },
    ]
    const initialOptionsGeneralArray = [
        {
            id: 1,
            name: 'Planos P&ID',
            isSelected: false,
            disabled: true
        },
        {
            id: 2,
            name: 'Procedimientos',
            isSelected: false,
            disabled: true
        },
        {
            id: 3,
            name: 'Criterios y filosofías',
            isSelected: false,
            disabled: true
        },
        {
            id: 4,
            name: 'Información de ingeniería',
            isSelected: false,
            disabled: true
        }
    ]

    const [optionsArray, setOptionsArray] = useState<any[]>(initialOptionsArray)

    const [optionsGeneralArray, setOptionsGeneralArray] = useState<any[]>(initialOptionsGeneralArray)

    const [showMenuone, setShowMenuone] = useState<boolean>(false)

    const handleClickArea = (id: number) => {
        setAreaInfo((prevstate: any) => {
            return {
                ...prevstate,
                children: areaInfo?.children.map((obj: any) => {
                    if (obj.id === id) {
                        return {
                            ...obj,
                            isSelected: !obj.isSelected
                        }
                    } else {
                        return {
                            ...obj,
                            isSelected: false
                        }
                    }
                })
            }
        })
    }

    const handleClickOption = (id: number, type: string) => {

        if (type === 'subareas') {
            setOptionsArray((prevstate: any[]) => prevstate.map((obj) => {
                if (obj.id === id) {
                    return {
                        ...obj,
                        isSelected: !obj.isSelected
                    }
                } else {
                    return {
                        ...obj,
                        isSelected: false
                    }
                }
            }))
        } else {
            setOptionsGeneralArray((prevstate: any[]) => prevstate.map((obj) => {
                if (obj.id === id) {
                    return {
                        ...obj,
                        isSelected: !obj.isSelected
                    }
                } else {
                    return {
                        ...obj,
                        isSelected: false
                    }
                }
            }))

        }

    }
    const data: any[] = [
        {
            id: "1",
            amount: 100,
            status: "failed",
            email: "2m@example.com",
        },
        {
            id: "2",
            amount: 120,
            status: "pending",
            email: "dwaxm@example.com",
        },
        {
            id: "3",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "4",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "5",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "6",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "7",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "8",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "9",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "10",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "11",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "12",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "13",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "14",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "15",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "16",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "17",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "18",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "19",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "20",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "21",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "22",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "23",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "24",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "25",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "26",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "27",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "28",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "29",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "30",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "31",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "32",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "33",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "34",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "35",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "36",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "37",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "38",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "39",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "40",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        {
            id: "41",
            amount: 400,
            status: "pending",
            email: "3213m@example.com",
        },
        // ...
    ]


    const optionSelected = optionsArray.find((obj) => obj.isSelected)
    const areasssSelected = areaInfo?.children.find((obj: any) => obj.isSelected)


    const [areaDocuments, setAreaDocuments] = useState<any[] | null>(null)
    const [equipmentsByArea, setEquipmentsByArea] = useState<any[] | null>(null)

    const getInfo = async () => {
        if (areasssSelected) {
            try {
                const response = await getDocsByAreaByEq(areasssSelected.id)
                setAreaDocuments(response.data)

                const respEq = await getEquipmentsByEntityId(areasssSelected.id)
                setEquipmentsByArea(respEq.data.data.map((obj: any) => { return { ...obj, isSelected: false } }))

            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        getInfo()
    }, [areasssSelected])


    const handleSelectedEquipment = (id: number) => {
        setEquipmentsByArea((prevstate: any) => prevstate.map((obj: any) => {
            if (obj.equipment_id === id) {
                return {
                    ...obj,
                    isSelected: !obj.isSelected
                }
            } else {
                return {
                    ...obj,
                    isSelected: false
                }
            }
        }))
    }


    const renderDocuments = (optionSelected: number) => {
        switch (optionSelected) {
            case 1:
                return (
                    <div>
                        <h1>otro</h1>
                    </div>
                )

            case 2:
                return (
                    <div className='w-full h-full overflow-auto'>
                        {
                            areasssSelected && areaDocuments !== null ?
                                <div className='w-full h-full overflow-auto'>
                                    <DataTable columns={columns} data={areaDocuments.data} />
                                </div>
                                : null
                        }
                    </div>
                )
            case 3:
                return (
                    <div className='h-full w-full flex justify-center items-center'>
                        <Carousel className="w-[94%]">
                            <CarouselContent className="-ml-1 w-full">
                                {equipmentsByArea?.map((obj, index) => (
                                    <CarouselItem onClick={() => handleSelectedEquipment(obj.equipment_id)} key={index} className={`transition-all duration-300 pl-1 md:basis-1/2 lg:basis-[230px] border-none hover:bg-slate-300 cursor-pointer ${obj.isSelected ? 'bg-slate-300' : ''}`}>
                                        <div className="p-1 flex flex-col justify-center items-center border-r">
                                            <span className="text-md text-center">{obj.tag}</span>
                                            <p className='text-sm'>{obj.name}</p>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className='bg-[#f8f8fd] rounded-none border-l-0 border-r border-t-0 border-b-0 h-full' />
                            <CarouselNext className='bg-[#f8f8fd] rounded-none border-l border-t-0 border-b-0 h-full' />

                        </Carousel>
                    </div>
                )
            case 4:
                return (
                    <div>
                        Esto 4
                    </div>
                )
            case 5:
                return (
                    <div>
                        Esto 5
                    </div>
                )

            default:
                break;
        }
        return null
    }


    const equipmentSelected = equipmentsByArea?.find((obj) => obj.isSelected)

    const [docsByEquipment, setDocsByEquipment] = useState<{
        dataSheet: any
        detailPlans: any
        electricPlans: any
        others: any
        lists: any
    } | null>(null)

    const getDocsByEquipmentId = async () => {
        try {
            const response = await getDocumentsByArea(equipmentSelected.equipment_id, '3')
            console.log(response.data)

            setDocsByEquipment({
                ...docsByEquipment,
                dataSheet: response.data.data.filter((obj) => obj.document_id.aux_module_id.id === 102 && obj.document_id.aux_discipline_id.id === 205 && obj.document_id.aux_type_id.id === 334),
                detailPlans: response.data.data.filter((obj) => obj.document_id.aux_module_id.id === 102 && obj.document_id.aux_discipline_id.id === 205 && obj.document_id.aux_type_id.id === 339),
                electricPlans: response.data.data.filter((obj) => obj.document_id.aux_module_id.id === 102 && obj.document_id.aux_discipline_id.id === 203 && obj.document_id.aux_type_id.id === 324),
                others: [],
                lists: response.data.data.filter((obj) => obj.document_id.aux_module_id.id === 102 && obj.document_id.aux_discipline_id.id === 205 && obj.document_id.aux_type_id.id === 335),
            })

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (equipmentSelected !== undefined) {
            getDocsByEquipmentId()
        }
    }, [equipmentSelected])




    const renderOptions = () => {
        return (
            <div className='flex flex-row justify-between items-center w-full bg-[#f8f8fd] rounded-b'>
                {optionsArray.map((obj) => {

                    return (
                        <Button disabled={obj.disabled} onClick={() => handleClickOption(obj.id, 'subareas')} className={`flex flex-row justify-center items-center gap-2 w-full hover:bg-slate-300 p-1 border-slate-200 border ${obj.isSelected ? 'bg-slate-300' : ''}`} key={obj.id}>
                            <p className='text-sm'>{obj.name}</p>
                        </Button>
                    )
                })}
            </div>
        )
    }

    const renderOptionsGeneralInfo = () => {
        return (
            <div className='flex flex-row justify-between items-center w-full bg-[#f8f8fd] rounded-b'>
                {optionsGeneralArray.map((obj) => {

                    return (
                        <Button disabled={obj.disabled} onClick={() => handleClickOption(obj.id, 'generalinfo')} className={`flex flex-row justify-center items-center gap-2 w-full hover:bg-slate-300 p-1 border-slate-200 border ${obj.isSelected ? 'bg-slate-300' : ''}`} key={obj.id}>
                            <p className='text-sm'>{obj.name}</p>
                        </Button>
                    )
                })}
            </div>
        )
    }




    const renderDocsByEqSelected = () => {
        return (
            <div className='p-1'>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className='h-10'>Hoja de Datos</AccordionTrigger>
                        <AccordionContent>
                            <div className='w-full h-full overflow-auto'>
                                {
                                    equipmentSelected !== null ?
                                        docsByEquipment?.dataSheet.length > 0 ?
                                            <div className='w-full h-full overflow-auto'>
                                                <DataTable columns={columns} data={docsByEquipment?.dataSheet} />
                                            </div>
                                            : <p>No posee documentos</p>
                                        : null
                                }
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className='h-10'>Planos de detalle</AccordionTrigger>
                        <AccordionContent>
                            <div className='w-full h-full overflow-auto'>
                                {
                                    equipmentSelected !== null ?
                                        docsByEquipment?.detailPlans.length > 0 ?
                                            <div className='w-full h-full overflow-auto'>
                                                <DataTable columns={columns} data={docsByEquipment?.detailPlans} />
                                            </div>
                                            : <p>No posee documentos</p>
                                        : null
                                }
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className='h-10'>Planos eléctricos</AccordionTrigger>
                        <AccordionContent>
                            <div className='w-full h-full overflow-auto'>
                                {
                                    equipmentSelected !== null ?
                                        docsByEquipment?.electricPlans.length > 0 ?
                                            <div className='w-full h-full overflow-auto'>
                                                <DataTable columns={columns} data={docsByEquipment?.electricPlans} />
                                            </div>
                                            : <p>No posee documentos</p>
                                        : null
                                }
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger className='h-10'>Otros</AccordionTrigger>
                        <AccordionContent>
                            <div className='w-full h-full overflow-auto'>
                                {
                                    equipmentSelected !== null ?
                                        docsByEquipment?.others.length > 0 ?
                                            <div className='w-full h-full overflow-auto'>
                                                <DataTable columns={columns} data={docsByEquipment?.others} />
                                            </div>
                                            : <p>No posee documentos</p>
                                        : null
                                }
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger className='h-10'>Listados</AccordionTrigger>
                        <AccordionContent>
                            <div className='w-full h-full overflow-auto'>
                                {
                                    equipmentSelected !== null ?
                                        docsByEquipment?.lists.length > 0 ?
                                            <div className='w-full h-full overflow-auto'>
                                                <DataTable columns={columns} data={docsByEquipment?.lists} />
                                            </div>
                                            : <p>No posee documentos</p>
                                        : null
                                }
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        )
    }


    console.log("Option selected", optionSelected);
    console.log("Equipment selected", equipmentSelected);
    console.log("DOCUMENTS BY EQUIPMENT OBJECT", docsByEquipment);




    return (
        <div className='flex flex-col w-full h-full overflow-hidden'>
            {
                option === null ? <p>Debe seleccionar una planta</p> :
                    <div className='h-full w-full overflow-auto my-9'>
                        <div className='border-slate-200 border rounded flex flex-col overflow-hidden'>
                            <div className='bg-[#1bb398] p-1 rounded-t'>
                                <h1 className='text-md text-white ml-2'>Sub Áreas</h1>
                            </div>
                            <div className='flex flex-row justify-between items-center w-full bg-[#f8f8fd] rounded-b'>
                                {areaInfo === null ? <p>Cargando...</p> : areaInfo?.children.map((obj: any) => {
                                    return (
                                        <button onClick={() => { handleClickArea(obj.id) }} className={`flex flex-row justify-center items-center gap-2 w-full hover:bg-slate-300 p-1 border-slate-200 border ${obj.isSelected ? 'bg-slate-300' : ''}`} key={obj.id}>
                                            <FaDiceD6 />
                                            <p className='text-sm'>{obj.name}</p>
                                        </button>
                                    )
                                })}
                            </div>
                            {areasssSelected !== undefined ? renderOptions() : null}
                            <div className='h-full overflow-hidden'>
                                {areasssSelected !== undefined && optionSelected !== undefined ? renderDocuments(optionSelected.id) : null}
                            </div>
                            {
                                equipmentSelected !== undefined && optionSelected?.id === 3 ? renderDocsByEqSelected() : null
                            }
                        </div>
                        <div className='border-slate-200 border rounded flex flex-col overflow-hidden mt-5'>
                            <div className='bg-[#1bb398] p-1 rounded-t'>
                                <h1 className='text-md text-white ml-2'>Información general</h1>
                            </div>
                            {renderOptionsGeneralInfo()}
                        </div>
                    </div>

            }



        </div>
    )
}
