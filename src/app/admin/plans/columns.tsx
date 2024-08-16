import { ColumnsPropsStructure, PlanStructure } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

export const columnsPlans= ({ onEdit, onDelete }: ColumnsPropsStructure): ColumnDef<PlanStructure>[] => [
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
    }
]

