import { ColumnsPropsStructure, Map2dShapesStructure } from "@/lib/utils";
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
import {  FaTrashCan } from "react-icons/fa6";



export const columnsMapShapes2d = ({ onEdit, onDelete }: ColumnsPropsStructure): ColumnDef<Map2dShapesStructure>[] => [

    {
        accessorKey: 'id',
        header: 'Id'
    },
    {
        accessorKey: 'shapes',
        header: 'Shapes'
    },
    {
        accessorKey: 'entity',
        header: 'Entidad'
    },
    {
        accessorKey: 'photogrammetry_node',
        header: 'Node'
    },
    {
        accessorKey: 'mappplan2d',
        header: 'Mapa2d'
    },
    {
        accessorKey: 'shape_icon',
        header: 'Icono shape'
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
                        <DropdownMenuItem onClick={() => { onEdit(row.original) }} className='flex flex-row gap-2 justify-start items-center p-3 hover:cursor-pointer'>
                            <FilePen size={18} />
                            <p>Editar</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { onDelete(row.original) }} className='flex flex-row gap-2 justify-start items-center p-3 hover:cursor-pointer'>
                            <FaTrashCan size={18} />
                            <p>Eliminar</p>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]