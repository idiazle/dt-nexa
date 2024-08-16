import { ColumnsPropsStructure } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'
import { AiFillFile, AiFillFileImage } from "react-icons/ai";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { FilePen, MoreHorizontal } from "lucide-react";
import { FaTrashCan } from "react-icons/fa6";

export const columnsDespieces = ({ onEdit, onDelete }: ColumnsPropsStructure): ColumnDef<any>[] => [
    {
        accessorKey: 'id',
        header: 'Id'
    },
    {
        header: 'Nombre',
        accessorKey: 'name',
        cell: ({ row }) => {
            const name = 'equipment_data' in row.original ? row.original?.equipment_data?.name : row.original?.entity_data?.name
            return (
                <p>{name}</p>
            )
        }
    },
    {
        header: 'Tag',
        cell: ({ row }) => {
            const name = 'equipment_data' in row.original ? row.original?.equipment_data?.tag : 'No es un equipo'
            return (
                <p>{name}</p>
            )
        }
    },
    {
        header: 'Imagenes y Archivo',
        cell: ({ row }) => {
            return (
                <div className="flex flex-row justify-normal items-center">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={'ghost'} size={'icon'}>
                                <AiFillFileImage size={20} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='overflow-auto'>
                            {/* <PopoverArrow /> */}
                            {/* <PopoverCloseButton /> */}
                            {/* <PopoverHeader>Enlace del archivo</PopoverHeader> */}
                            {/* <PopoverBody> */}
                            <div className='flex flex-row overflow-auto justify-center items-center gap-5'>
                                <Image
                                    src={row.original.img_gif || '/img/icons/default-icon.png'}
                                    width={60}
                                    height={60}
                                    alt={'equipment_data' in row.original ? row.original?.equipment_data?.name : row.original?.entity_data?.name || row.original.id}
                                />
                                <a target='_blank' href={row.original.img_gif}>{row.original.img_gif !== null ? 'Ver ' + row.original?.equipment_data?.name : 'No tiene imagen'}</a>
                            </div>
                            {/* </PopoverBody> */}
                        </PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={'ghost'} size={'icon'}>
                                <AiFillFileImage size={20} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='overflow-auto'>
                            {/* <PopoverArrow /> */}
                            {/* <PopoverCloseButton /> */}
                            {/* <PopoverHeader>Enlace del archivo</PopoverHeader> */}
                            {/* <PopoverBody> */}
                            <div className='flex flex-row overflow-auto justify-center items-center gap-5'>
                                <Image
                                    src={row.original.img_gif || '/img/icons/default-icon.png'}
                                    width={60}
                                    height={60}
                                    alt={'equipment_data' in row.original ? row.original?.equipment_data?.name : row.original?.entity_data?.name || row.original.id}
                                />
                                <a target='_blank' href={row.original.img_gif}>{row.original.img_gif !== null ? 'Ver ' + row.original?.equipment_data?.name : 'No tiene imagen'}</a>
                            </div>
                            {/* </PopoverBody> */}
                        </PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={'ghost'} size={'icon'}>
                                <AiFillFile size={20} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='overflow-auto flex flex-row justify-center items-center'>
                            <a target='_blank' href={row.original.aux_file_url}>{row.original.aux_file_url ? row.original.aux_file_url : 'No posee archivo'}</a>
                        </PopoverContent>
                    </Popover>
                </div>
            )
        }
    },
    {
        accessorKey: 'control_interactive',
        header: 'Tipo'
    },
    {
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