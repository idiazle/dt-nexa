import { getEntityById } from '@/api/admin/entities-api'
import { OptionAsideContext } from '@/context/option-aside-context'
import { EntityStructure } from '@/lib/utils'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { FaDiceD6 } from 'react-icons/fa6'
import { DataTable } from '@/app/user/data-table'
import { columns, Payment } from '@/app/user/columns-table'

export default function UserAreaContainer() {

    const { option } = useContext(OptionAsideContext)
    const [areaInfo, setAreaInfo] = useState<EntityStructure | null>(null)

    const getAreaInfo = async () => {
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
            isSelected: false
        },
        {
            id: 2,
            name: 'Documentos Generales',
            isSelected: false
        },
        {
            id: 3,
            name: 'Equipos de Proceso',
            isSelected: false
        },
        {
            id: 4,
            name: 'Planos Interactivos P&ID',
            isSelected: false
        },
        {
            id: 5,
            name: 'Planos de Proceso',
            isSelected: false
        },
    ]

    const [optionsArray, setOptionsArray] = useState<any[]>(initialOptionsArray)

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

    const handleClickOption = (id: number) => {
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
    }
    const data: Payment[] = [
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
                        <DataTable columns={columns} data={data} />
                    </div>
                )
            case 3:
                return (
                    <div>
                        Esto 3
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


    const optionSelected = optionsArray.find((obj) => obj.isSelected)

    const renderOptions = () => {
        return (
            <div className='flex flex-row justify-between items-center w-full bg-[#f8f8fd] rounded-b'>
                {optionsArray.map((obj) => {

                    return (
                        <button onClick={() => handleClickOption(obj.id)} className={`flex flex-row justify-center items-center gap-2 w-full hover:bg-slate-300 p-1 border-slate-200 border ${obj.isSelected ? 'bg-slate-300' : ''}`} key={obj.id}>
                            <p className='text-sm'>{obj.name}</p>
                        </button>
                    )
                })}
            </div>
        )
    }


    const areasssSelected = areaInfo?.children.find((obj: any) => obj.isSelected)



    return (
        <div className='flex flex-col w-full h-full overflow-hidden'>
            <div className='border-slate-200 border rounded flex flex-col h-full overflow-auto'>
                <div className='bg-[#1bb398] p-1 rounded-t'>
                    <h1 className='text-md text-white ml-2'>Sub Áreas</h1>
                </div>
                <div className='flex flex-row justify-between items-center w-full bg-[#f8f8fd] rounded-b'>
                    {areaInfo?.children.map((obj: any) => {
                        return (
                            <button onClick={() => { handleClickArea(obj.id) }} className={`flex flex-row justify-center items-center gap-2 w-full hover:bg-slate-300 p-1 border-slate-200 border ${obj.isSelected ? 'bg-slate-300' : ''}`} key={obj.id}>
                                <FaDiceD6 />
                                <p className='text-sm'>{obj.name}</p>
                            </button>
                        )
                    })}
                </div>
                {areasssSelected !== undefined ? renderOptions() : null}
                {optionSelected !== undefined ? renderDocuments(optionSelected.id) : null}

            </div>

        </div>
    )
}
