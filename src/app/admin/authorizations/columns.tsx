import { AuthorizationStructure, ColumnsPropsStructure } from "@/lib/utils";
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
  import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { FaFilePen, FaTrashCan } from "react-icons/fa6";


export const columnsAuthorizations = ({ onEdit, onDelete }: ColumnsPropsStructure): ColumnDef<AuthorizationStructure>[] => [

    {
        accessorKey: 'id',
        header: 'Id'
    },
    {
        accessorKey: 'name',
        header: 'Nombre de grupo'
    },
    {
        accessorKey: 'permissions',
        header: 'Permisos',
        cell: ({ row }) => {
            const permission = row.original.user_permissions.slice(0, 7)
            return (
                <div

                    className='flex flex-row justify-start items-center gap-3'
                // onClick={() => { column.toggleSorting(column.getIsSorted() === 'asc') }}
                >
                    {permission.map((obj: any, index: number) => {
                        const permAdd = obj.crud_perm.add === true ? 'C.' : ''
                        const permChange = obj.crud_perm.change === true ? 'U.' : ''
                        const permDelete = obj.crud_perm.delete === true ? 'D.' : ''
                        const permView = obj.crud_perm.view === true ? 'R' : ''
                        const totalPerm = permAdd + permChange + permDelete + permView
                        return (
                            <div key={index} className='flex flex-col justify-center items-center border-r-2 px-2 min-w-36'>
                                <p className='border-b-2 w-full text-center'>{index + 1}</p>
                                <div className='mt-2'>
                                    <p> Modelo: {obj.model.replaceAll('"', '')}</p>
                                    <p> Permisos: {totalPerm}</p>
                                </div>
                            </div>
                        )
                    })}
                    {/* {row.original.user_permissions.slice(0, 3).length >= 0 ? <span>Ver más ({row.original.user_permissions.length})</span> : null} */}
                    <p>{permission.length > 7 ? <span>Ver más ({row.original.user_permissions.length})</span> : null}</p>
                </div>
            )
        }

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