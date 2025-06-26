import { ColumnsPropsStructure, EntityStructure, PhotogrametryStructure, UserStructure } from "@/lib/utils";
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
import { TbView360 } from "react-icons/tb";

interface Columns360PropsStructure extends ColumnsPropsStructure {
  onView360: (obj: any) => void
}

const renderNodeType = (nType: number) => {
  let name = ''

  if (nType === 2) {
    name = 'Punto de Navegación'
  } else if (nType === 3) {
    name = 'Punto de Equipo'
  } else if (nType === 4) {
    name = 'Punto auxiliar'
  }
  return name
}

export const columnsNodes360Photos = ({ onEdit, onDelete, onView360 }: Columns360PropsStructure): ColumnDef<PhotogrametryStructure>[] => [

  {
    accessorKey: 'id',
    header: 'Id'
  },
  {
    accessorKey: 'name',
    header: 'Nombre'
  },
  {
    accessorKey: 'node_type',
    header: 'Tipo de nodo',
    cell: ({ row }) => {
      return (
        <p>{renderNodeType(row.original.node_type)}</p>
      )
    }
  },
  {
    accessorKey: 'caption',
    header: 'Leyenda'
  },
  {
    accessorKey: 'panorama',
    header: 'Panorama',
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center">
          <Dialog>
            <ContextMenu>
              <ContextMenuTrigger className='flex items-center justify-center'>
                <div className="w-full relative">
                  <Image
                    alt={row.original.thumbnail}
                    src={row.original.thumbnail}
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
                  src={row.original.panorama}
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
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      return (
        // <DropdownMenu open={isDropOpen} onOpenChange={setIsDropOpen}>
        // <DropdownMenu>
        //   <DropdownMenuTrigger asChild>
        //     <Button variant="ghost" className="h-8 w-full p-0">
        //       {/* <span className="sr-only">Open menu</span> */}
        //       <MoreHorizontal className="h-4 w-4" />
        //     </Button>
        //   </DropdownMenuTrigger>
        //   <DropdownMenuContent align="end" >
        //     <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        //     <DropdownMenuSeparator />
        <div className='flex flex-row gap-2 justify-end'>
          <Button onClick={() => { onView360(row.original) }} className='flex flex-row gap-2 justify-start items-center p-3'>
            <TbView360 size={18} />
            <p>Visualizar</p>
          </Button>
          <Button onClick={() => { onEdit(row.original) }} className='flex flex-row gap-2 justify-start items-center p-3'>
            <FilePen size={18} />
            <p>Editar</p>
          </Button>
          <Button variant={"destructive"} onClick={() => { onDelete(row.original) }} className='flex flex-row gap-2 justify-start items-center p-3'>
            <FaTrashCan size={18} />
            <p>Eliminar</p>
          </Button >
        </div>
        //   </DropdownMenuContent>
        // </DropdownMenu>
      )
    }
  }
]