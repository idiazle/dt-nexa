'use client'
import { DocumentStructure } from '@/lib/utils'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { columnsDocuments } from './columns'
import { useRouter } from 'next/navigation'
import DocumentDialog from '@/components/admin/documents/document-dialog'
import AlertDeleteDialog from '@/components/general/alert-delete-dialog'
import { deleteDocument, getDocuments, getDocumentsNoToken } from '@/api/admin/documents-api'
import { toast } from '@/components/ui/use-toast'
import { DataTable } from './data-table'
import { useSession } from 'next-auth/react'


interface DocumentTableStructure {
    data: DocumentStructure[]
    pageNumber: number
    totalPages: number
    rowsPerPage: number
    totalDocuments: number
}

export default function DocumentsTable({ data, pageNumber, totalPages, rowsPerPage, totalDocuments }: DocumentTableStructure) {




    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [myData, setMyData] = useState<any[]>([])
    const [page, setPage] = useState<{
        pageIndex: number,
        pageSize: number,
        rowsPerPage: number,
        totalDocuments: number
    }>({
        pageIndex: 1,
        pageSize: totalPages,
        rowsPerPage: rowsPerPage,
        totalDocuments: totalDocuments
    })
    const loadingState = isLoading || data.length === 0 ? 'loading' : 'idle'


    const getData = async () => {
        const response = await getDocumentsNoToken(page.pageIndex)


        if (response.status === 200) {
            setIsLoading(false)
            setMyData(response.data.data)
        } else {
            setIsLoading(true)
        }
    }
    useEffect(() => {
        getData()
        // console.log(myData)
    }, [page, isLoading])


    const [documentSelected, setDocumentSelected] = useState<DocumentStructure | null>(null)
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
    const onViewDoc = useCallback((document: any) => {
        console.log(document);
        setDocumentSelected(document);
        setDialogOpen(true);
    }, []);
    const onViewDownload = useCallback((document: any) => {
        console.log(document);
        setDocumentSelected(document);
        setDialogOpen(true);
    }, []);
    const onViewRefs = useCallback((document: any) => {
        console.log(document);
        setDocumentSelected(document);
        setDialogOpen(true);
    }, []);


    const columns = useMemo(() => columnsDocuments({ onEdit, onDelete, onViewDoc, onViewDownload, onViewRefs }), [])

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
            <DataTable columns={columns} data={myData} setPagination={setPage} pagination={page} setMyData={setMyData} />
            {
                dialogOpen && documentSelected !== null ? <DocumentDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} setTempFile={() => { }} tempFile={null} id={documentSelected.id} /> : null
            }
            {
                openAlertDelete && documentSelected !== null ? <AlertDeleteDialog open={openAlertDelete} setOpen={setOpenAlertDelete} executeMethod={delDocument} objName={documentSelected.title} /> : null
            }
        </div>
    )
}
