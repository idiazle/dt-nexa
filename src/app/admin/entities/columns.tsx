'use client'

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
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { type EntityStructure } from '@/lib/utils'
import Image from 'next/image'
import { FaFilePen, FaTrashCan } from 'react-icons/fa6'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { ToastAction } from '@/components/ui/toast'
import EntityDialog from '@/components/admin/entities/entity-dialog'
import { useState } from 'react'
import FormEntity from '@/components/admin/entities/form-entity'
import { deleteEntity } from '@/api/admin/entities-api'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: Array<ColumnDef<EntityStructure>> = [

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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => { column.toggleSorting(column.getIsSorted() === 'asc') }}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: 'description',
    header: 'Descripción'
  },
  {
    accessorKey: 'type',
    header: () => <div className="text-center">Tipo</div>,
    cell: ({ row }) => {
      const typeText = row.getValue('type')
      const retText = typeText === 4 ? 'Gerencia/Planta' : 'Área'
      return <div className="text-center font-medium">{retText}</div>
    }
  },
  {
    accessorKey: 'image',
    header: () => <div className="text-right">Imagen</div>,
    cell: ({ row }) => {
      // const image = row.getValue('image') || '/img/logo_main_dp.png' as any
      return (
        <div className="h-full w-full">
          {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            row.getValue('image') ? <Image alt={row.getValue('id')} src={row.getValue('image') || '/img/logo_main_dp.png'} width={60} height={60} /> : <p>No tiene imagen</p>
          }
        </div>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      // console.log("MY ROW",row.getValue('id'));
      const router = useRouter()
      const { toast } = useToast()
      const [dialogEntity, setDialogEntity] = useState<boolean>(false)
      const delEntity = async (id: number) => {
        // console.log('ENTRANDO EN DELENTITY', id)

        try {
          const response = await deleteEntity(id)
          // console.log("MY RESPONSE", response);

          if (response.status === 200) {
            // alert("AWD")
            router.refresh()
            toast({
              duration: 3000,
              variant: 'destructive',
              title: 'Eliminación ',
              description: 'Entidad eliminada correctamente'
            })
          }
        } catch (error) {
          throw new Error('Error al eliminar la entidad')
        }
      }
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
            {/* <DropdownMenuItem className='flex flex-row gap-2 justify-start items-center p-3 hover:cursor-pointer'>
              <FaFilePen size={18} />

              <p>Editar</p>
            </DropdownMenuItem> */}
            <div className='flex rounded flex-row gap-2 justify-start items-center p-3 hover:cursor-pointer hover:bg-slate-400/30'>
              <FaFilePen size={18} />
              <EntityDialog id={Number(row.getValue('id'))} />
            </div>
            <DropdownMenuItem onClick={async () => { await delEntity(Number(row.getValue('id'))) }} className='flex flex-row gap-2 justify-start items-center p-3 hover:cursor-pointer'>
              <FaTrashCan size={18} />
              <p>Eliminar</p>
            </DropdownMenuItem>
          </DropdownMenuContent>

        </DropdownMenu>
      )
    }
  }
  // {
  //   accessorKey: 'email',
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => { column.toggleSorting(column.getIsSorted() === 'asc') }}
  //       >
  //         Email
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     )
  //   }
  // }
]
