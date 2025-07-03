import { ColumnsPropsStructure, EntityStructure, Map2dStructure, UserStructure } from "@/lib/utils";
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
import { FaFilePen, FaMapLocationDot, FaTrashCan } from "react-icons/fa6";
import Image from "next/image";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link";

const renderMapType = (type: number) => {
  let returnType = ''
  if (type === 1) {
    returnType = 'PFD'
  } else if (type === 2) {
    returnType = 'RBD'
  } else if (type === 3) {
    returnType = 'PND'
  } else {
    returnType = 'General'
  }
  return returnType
}




export const columnsMap2d = ({ onEdit, onDelete }: ColumnsPropsStructure): ColumnDef<Map2dStructure>[] => [

  {
    accessorKey: 'id',
    header: 'Id'
  },
  {
    accessorKey: 'name',
    header: 'Nombre'
  },
  {
    accessorKey: 'file',
    header: 'Archivo',
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <Dialog>
            <ContextMenu>
              <ContextMenuTrigger className='flex items-center justify-center'>
                <div className="w-full relative">
                  <Image
                    alt={row.original.name}
                    src={row.original.file}
                    height={100}
                    width={100}
                  />
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent hideWhenDetached={false}>
                <DialogTrigger asChild>
                  <ContextMenuItem>Ampliar</ContextMenuItem>
                </DialogTrigger>
              </ContextMenuContent>
            </ContextMenu>
            <DialogContent className="max-h-[75vh] overflow-auto min-w-[50vw]">
              <DialogHeader>
                <DialogTitle>
                  {row.original.name}
                </DialogTitle>
                {/* <DialogDescription>
                                This action cannot be undone. Are you sure you want to permanently
                                delete this file from our servers?
                            </DialogDescription> */}
              </DialogHeader>
              <div className='flex justify-center items-center'>
                <Image
                  alt={row.original.name}
                  src={row.original.file}
                  width={750}
                  height={350}
                />
              </div>

            </DialogContent>
          </Dialog>
        </div >
      )
    }
  },
  {
    accessorKey: 'map_type',
    header: 'Tipo de mapa',
    cell: ({ row }) => {
      return (
        renderMapType(Number(row.original.map_type))
      )
    }
  },
  {
    accessorKey: 'entity',
    header: 'Entidad',
    cell: ({ row }) => {
      return (
        <p>{row.original.entity.name}</p>
      )
    }
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
            <DropdownMenuItem >
              <Link
                className='flex flex-row gap-2 justify-start items-center p-2 hover:cursor-pointer w-full'
                href={{
                  pathname: '/interactives/',
                  query: { id: row.original.id }
                }} as={`/interactives?map-id=${row.original.id}&map-type=${row.original.map_type}`}>
                <FaMapLocationDot />
                <p>Shapes</p>
              </Link>
            </DropdownMenuItem>
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