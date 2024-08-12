import { ColumnsPropsStructure, EquipmentStructure } from "@/lib/utils";
import { type ColumnDef } from '@tanstack/react-table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import { FaFilePen, FaTrashCan } from "react-icons/fa6";

export const columnsEquipments = ({ onEdit, onDelete }: ColumnsPropsStructure): ColumnDef<EquipmentStructure>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => { table.toggleAllPageRowsSelected(!!value) }}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => { row.toggleSelected(!!value) }}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'equipment_id',
        header: 'Id'
    },
    {
        accessorKey: 'tag',
        header: () => <div className="text-center">TAG</div>,
        cell: ({ row }) => {
            // const image = row.getValue('tag') || '/img/logo_main_dp.png' as any
            return (
                <div className="h-full w-full">
                    <p>{row.getValue('tag')}</p>
                </div>
            )
        }
    },
    {
        accessorKey: 'name',
        header: 'Nombre'
    },
    {
        accessorKey: 'level_data.description',
        header: 'Description'
    },
    {
        accessorKey: 'manufacturer_id.name',
        header: 'Fabricante'
    },
    {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className='p-3'>
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { onEdit(row.original) }} className='flex flex-row gap-2 justify-start items-center p-3 hover:cursor-pointer'>
                            <FaFilePen size={18} />
                            <p>Editar</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(row.original)} className='flex flex-row gap-2 justify-start items-center p-3 hover:cursor-pointer'>
                            <FaTrashCan size={18} />
                            <p>Eliminar</p>
                        </DropdownMenuItem>
                    </DropdownMenuContent>

                </DropdownMenu>
            )
        }
    }

]