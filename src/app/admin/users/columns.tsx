import { ColumnsPropsStructure, EntityStructure, UserStructure } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { FilePen, MoreHorizontal } from "lucide-react";
import { FaFilePen, FaTrashCan } from "react-icons/fa6";


export const columnsUsers = ({ onEdit, onDelete }: ColumnsPropsStructure): ColumnDef<UserStructure>[] => [

    {
        accessorKey: 'id',
        header: 'Id'
    },
    {
        accessorKey: 'code',
        header: 'Código'
    },
    {
        accessorKey: 'name',
        header: 'Nombre'
    },
    {
        accessorKey: 'last_name',
        header: 'Apellido'
    },
    {
        accessorKey: 'username',
        header: 'Nombre de usuario'
    },
    {
        accessorKey: 'dui',
        header: 'DNI'
    },
    {
        accessorKey: 'short_name',
        header: 'Nombre corto'
    },
    {
        accessorKey: 'position',
        header: 'Posición'
    },
    {
        accessorKey: 'email',
        header: 'Email'
    },
    {
        accessorKey: 'groups_data',
        header: 'Grupos'
    },
    {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
            return (
                // <DropdownMenu open={isDropOpen} onOpenChange={setIsDropOpen}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-full p-0">
                            {/* <span className="sr-only">Open menu</span> */}
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" >
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { onEdit(row.original) }} className='flex flex-row gap-2 justify-start items-center p-3'>
                            <FilePen size={18} />
                            <p>Editar</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { onDelete(row.original) }} className='flex flex-row gap-2 justify-start items-center p-3'>
                            <FaTrashCan size={18} />
                            <p>Eliminar</p>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]