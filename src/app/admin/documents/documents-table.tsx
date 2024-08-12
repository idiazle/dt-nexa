'use client'
import { DocumentStructure } from '@/lib/utils'
import React, { useCallback, useMemo, useState } from 'react'
import { columnsDocuments } from './columns'
import { useRouter } from 'next/navigation'
import DocumentDialog from '@/components/admin/documents/document-dialog'
import AlertDeleteDialog from '@/components/general/alert-delete-dialog'
import { deleteDocument } from '@/api/admin/documents-api'
import { toast } from '@/components/ui/use-toast'
import { DataTable } from './data-table'


interface DocumentTableStructure {
    data: DocumentStructure[]
}

export default function DocumentsTable({ data }: DocumentTableStructure) {

    const [documentSelected, setDocumentSelected] = useState<DocumentStructure|null>(null)
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [openAlertDelete, setOpenAlertDelete] = useState<boolean>(false)
    const router = useRouter()

    const onDelete = useCallback(async (document: any) => {
        setOpenAlertDelete(true)
        setDocumentSelected(document)
    }, []);
    const onEdit = useCallback((document: any) => {
        console.log(document);
        setDocumentSelected(document);
        setDialogOpen(true);
    }, []);
    const columns = useMemo(() => columnsDocuments({ onEdit, onDelete }), [])

    const delDocument = async () => {
        if (documentSelected !== null) {
            try {
                const response = await deleteDocument(documentSelected.id)
                if (response.status === 200) {
                    router.refresh()
                    toast({
                        duration: 3000,
                        variant: 'destructive',
                        title: 'Eliminación ',
                        description: 'Equipo eliminado correctamente'
                    })
                }
            } catch (error) {
                throw new Error('Error al eliminar la entidad')
            }
        }
    }
    return (
        <div>
            <DataTable columns={columns} data={data} />
            {
                dialogOpen && documentSelected !== null ? <DocumentDialog/> : null
            }
            {
                openAlertDelete && documentSelected !== null ? <AlertDeleteDialog open={openAlertDelete} setOpen={setOpenAlertDelete} executeMethod={delDocument} objName={documentSelected.title} /> : null
            }
        </div>
    )
}
