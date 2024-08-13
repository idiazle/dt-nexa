import { DocumentStructure } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { FaFileArrowDown, FaFilePen, FaLock, FaMagnifyingGlass, FaTrashCan, FaUnlock } from "react-icons/fa6";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { SiFiles } from 'react-icons/si'

interface ColumnsDocsPropsStructure {

    onViewDoc: (obj: any) => void
    onEdit: (obj: any) => void
    onDelete: (obj: any) => void
    onViewRefs: (obj: any) => void
    onViewDownload: (obj: any) => void

}

const isValidValue = (value: any) => {
    return value !== undefined && value !== null && value !== ''
}
export const columnsDocuments = ({ onEdit, onDelete, onViewDoc, onViewRefs, onViewDownload }: ColumnsDocsPropsStructure): ColumnDef<DocumentStructure>[] => [
    {
        accessorKey: 'id',
        header: 'Id'
    },
    {
        header: 'Título',
        accessorKey: 'title'
    },
    { header: 'Nombre del Archivo', accessorKey: 'filename' },
    { header: 'Autor', accessorKey: 'author' },
    { header: 'Disciplina', accessorKey: 'aux_discipline_id.name', },
    { header: 'Tipo', accessorKey: 'aux_type_id.name', },
    {
        header: 'Fec. Expiración',
        accessorKey: 'doc_expiracy',
        cell: ({ row }) => {
            return (
                <div className="flex h-full w-full justify-center items-center">
                    <p>{row.original?.date_expired !== null ? row.original?.date_expired?.toString().split('T')[0] : 'Sin fecha de expiración'}</p>
                </div>
            )
        }
    },
    {
        header: 'Fec. Carga',
        accessorKey: 'doc_load',
        cell: ({ row }) =>
            <div className="flex h-full w-full justify-center items-center">
                <p>{row.original?.date_load?.toString().split('T')[0]}</p>
            </div>
    },
    {
        header: 'Fec. de documento',
        accessorKey: 'doc_date',
        cell: ({ row }) =>
            <div className="flex h-full w-full justify-center items-center">
                <p>{row.original?.date_doc?.toString().split('T')[0]}</p>
            </div>
    },
    { header: 'Días de exp.', accessorKey: 'days_expired' },

    {
        header: 'Estado del Vendor',
        accessorKey: 'vendor_status',
        cell: ({ row }) =>
            <div className="flex h-full w-full justify-center items-center">
                <p className='text-xs' >{isValidValue(row.original?.vendor?.aux_status_vendor) ? `${row.original?.vendor?.aux_status_vendor?.name}` : 'Sin estatus'} </p>
            </div>
    },
    {
        header: 'Código del Vendor',
        accessorKey: 'vendor_code',
        cell: ({ row }) =>
            <div className="flex h-full w-full justify-center items-center">
                <p className='text-xs' >{isValidValue(row.original?.vendor?.code_vendor) ? `${row.original?.vendor?.code_vendor}` : 'Sin código'} </p>
            </div>
    },
    {
        header: 'Revisión del Vendor',
        accessorKey: 'vendor_revision',
        cell: ({ row }) =>
            <div className="flex h-full w-full justify-center items-center">
                <p className='text-xs' >{isValidValue(row.original?.vendor?.revision_vendor) ? `${row.original?.vendor?.revision_vendor}` : 'Sin revisión'} </p>
            </div>
    },
    {
        header: 'Revisión del Vendor por',
        accessorKey: 'vendor_revision_by',
        cell: ({ row }) =>
            <div className="flex h-full w-full justify-start items-center">
                <p className='text-xs'>{isValidValue(row.original?.vendor?.rev_vendor_by) ? `${row.original?.vendor?.rev_vendor_by}` : 'Sin revisión por'} </p>
            </div>
    },
    {
        header: 'Est. Cliente',
        accessorKey: 'client_status',
        cell: ({ row }) =>
            <div className="flex h-full w-full justify-start items-center">
                <p className='text-xs' >{isValidValue(row.original?.client?.aux_status_client) ? `${row.original?.client?.aux_status_client?.name}` : 'Sin estado'} </p>
            </div>
    },
    {
        header: 'Cód. Cliente',
        accessorKey: 'client_code',
        cell: ({ row }) =>
            <div className="flex h-full w-full justify-start items-center">
                <p className='text-xs' >{isValidValue(row.original?.client?.code_client) ? `${row.original?.client?.code_client}` : 'Sin código'} </p>
            </div>
    },
    {
        header: 'Rev. Cliente',
        accessorKey: 'client_revision',
        cell: ({ row }) =>
            <div className="flex h-full w-full justify-start items-center">
                <p className='text-xs' >{isValidValue(row.original?.client?.revision_client) ? `${row.original?.client?.revision_client}` : 'Sin revisión'} </p>
            </div>
    },
    {
        header: 'Rev. alterna del Cliente',
        accessorKey: 'client_revision_alt',
        cell: ({ row }) =>
            <div className="flex h-full w-full justify-center items-center">
                <p className='text-xs' >{isValidValue(row.original?.client?.revision_client_alt) ? `${row.original?.client?.revision_client_alt}` : 'Sin revisión alterna'} </p>
            </div>
    },
    {
        header: 'Rev. del cliente por',
        accessorKey: 'client_revision_by',
        cell: ({ row }) =>
            <div className="flex h-full w-full justify-center items-center">
                <p className='text-xs' >{isValidValue(row.original?.client?.revision_client_by) ? `${row.original?.client?.revision_client_by}` : 'Sin revisión por'} </p>
            </div>
    },
    {
        header: 'Contrato del cliente',
        accessorKey: 'client_po_contract',
        cell: ({ row }) =>
            <div className="flex h-full w-full justify-center items-center">
                <p className='text-xs' >{isValidValue(row.original?.client?.po_contract) ? `${row.original?.client?.po_contract}` : 'Sin contrato'} </p>
            </div>
    },
    {
        header: 'Conf.',
        accessorKey: 'confidential',
        cell: ({ row }) =>
            <div className="flex h-full w-full justify-center items-center">
                {row.original?.confidential === 1 ? <FaLock size={20} className="text-red-500" /> : <FaUnlock size={20} className="text-green-500" />}
            </div>
    },
    {
        id: 'actions',
        header:'Acciones',
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex justify-center items-center w-full" asChild>
                        <Button variant="ghost">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className='p-3'>
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { onViewDoc(row.original) }} className='flex flex-row gap-2 justify-start items-center p-3 hover:cursor-pointer'>
                            <FaMagnifyingGlass size={18} />
                            <p>Ver documento</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { onViewRefs(row.original) }} className='flex flex-row gap-2 justify-start items-center p-3 hover:cursor-pointer'>
                            <SiFiles size={18} />
                            <p>Ver referencias</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { onViewDownload(row.original) }} className='flex flex-row gap-2 justify-start items-center p-3 hover:cursor-pointer'>
                            <FaFileArrowDown size={18} />
                            <p>Download</p>
                        </DropdownMenuItem>
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