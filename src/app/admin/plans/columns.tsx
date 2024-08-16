import { ColumnsPropsStructure, PlanStructure } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { FaFileImage, FaFilePdf, FaFilePen, FaTrash } from 'react-icons/fa6'
import PlanDialog from '@/components/admin/plans/plan-dialog'

interface ColumnsPlansStructure extends ColumnsPropsStructure {
    onViewDocument: (obj: any, type: string) => void
}

export const columnsPlans = ({ onEdit, onDelete, onViewDocument }: ColumnsPlansStructure): ColumnDef<PlanStructure>[] => [
    {
        header: 'Código',
        accessorKey: 'code'
    },
    {
        header: 'Nombre',
        accessorKey: 'name',
    },
    {
        header: 'Descripción',
        accessorKey: 'description',
    },
    {
        header: 'Área',
        accessorKey: 'parent.name',
    },
    {
        header: 'Archivos',
        accessorKey: 'document',
        cell: ({ row }) => {
            // console.log(params.data.documents.length===0)
            // console.log(params?.data?.image)


            return (
                <div className="flex flex-row justify-center items-center h-full w-full">
                    <TooltipProvider>
                        <div className='flex flex-row gap-1'>
                            <Tooltip>
                                <TooltipTrigger className='relative' asChild>
                                    <Button disabled={row.original.image === null} variant="outline" size="icon" onClick={() => { onViewDocument(row.original, 'image') }}>
                                        <FaFileImage />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className='absolute right-5'>
                                    <p>Ver imagen del plano</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger className='relative' asChild>
                                    <Button disabled={row.original.documents.length === 0} variant="outline" size="icon" onClick={() => { onViewDocument(row.original, 'document') }}>
                                        <FaFilePdf />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className='absolute right-5'>
                                    <p>Ver documento pdf</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </TooltipProvider>
                </div>
            )
        }
    },
    {
        header: 'Acciones',
        accessorKey: 'document',
        cell: ({ row }) => {
            return (
                <div className="flex flex-row justify-center items-center h-full w-full">
                    <TooltipProvider>
                        <div className='flex flex-row gap-1'>
                            <Tooltip>
                                <TooltipTrigger className='relative' asChild>
                                    <Button variant="outline" size="icon" onClick={() => { onEdit(row.original) }}>
                                        <FaFilePen />

                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className='absolute right-5' onClick={() => {
                                    // console.log('dwa')
                                }}>
                                    <p>Editar plano</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger className='relative' asChild>
                                    <Button variant="outline" size={'icon'} onClick={() => { onDelete(row.original) }}>
                                        <FaTrash />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className='absolute right-5'>
                                    <p>Eliminar plano</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </TooltipProvider>
                </div>
            )
        }
    }
]

