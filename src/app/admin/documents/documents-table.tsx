'use client'
import { DocumentStructure, SearchInput } from '@/lib/utils'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { columnsDocuments } from './columns'
import { useRouter } from 'next/navigation'
import DocumentDialog from '@/components/admin/documents/document-dialog'
import AlertDeleteDialog from '@/components/general/alert-delete-dialog'
import { deleteDocument, getDocumentsNoToken, getSearchDocuments } from '@/api/admin/documents-api'
import { toast } from '@/components/ui/use-toast'
import { DataTable } from './data-table'
import ModalViewMedia from '@/components/viewers/modal-viewer'
import LinkDocumentDialog from '@/components/admin/documents/link-document-dialog'


interface DocumentTableStructure {
    data: DocumentStructure[]
    pageNumber: number
    totalPages: number
    rowsPerPage: number
    totalDocuments: number
}

export default function DocumentsTable({ data, pageNumber, totalPages, rowsPerPage, totalDocuments }: DocumentTableStructure) {



    const [refreshTable, setRefreshTable] = useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [myData, setMyData] = useState<any[]>([])
    const [page, setPage] = useState<{
        pageIndex: number,
        pageSize: number,
        rowsPerPage: number,
        totalDocuments: number,
        paginationType: string,
        searchDocuments: SearchInput | null
    }>({
        pageIndex: 1,
        pageSize: totalPages,
        rowsPerPage: rowsPerPage,
        totalDocuments: totalDocuments,
        paginationType: 'normal',
        searchDocuments: null
    })
    const loadingState = isLoading || data.length === 0 ? true : false


    const [actualCountRowPage, setActualCountRowPage] = useState<number>(30)

    const [dialogOpen, setDialogOpen] = useState<boolean>(false)


    const getData = async () => {

        if (page.paginationType === 'normal') {
            const response = await getDocumentsNoToken(actualCountRowPage === 1 ? 1 : page.pageIndex)
            if (response.status === 200) {
                setIsLoading(false)
                setMyData(response.data.data)
                setActualCountRowPage(response.data.quantity_in_page)
                if (actualCountRowPage === 1) {
                    setPage({
                        ...page,
                        pageSize: response.data.total_pages,
                        pageIndex: 1
                    })
                }

            } else {
                setIsLoading(true)
            }
        } else {
            const query = await getSearchDocuments(actualCountRowPage === 1 ? 1 : page.pageIndex, page.searchDocuments)
            if (query.status === 200) {
                setIsLoading(false)
                setMyData(query.data.results)
                setActualCountRowPage(query.data.quantity_in_page)
                if (actualCountRowPage === 1) {
                    setPage({
                        ...page,
                        pageSize: query.data.total_pages,
                        pageIndex: 1
                    })
                }
            } else {
                setIsLoading(true)
            }

        }
    }
    useEffect(() => {
        getData()
    }, [page, refreshTable])


    const [documentSelected, setDocumentSelected] = useState<DocumentStructure | null>(null)
    const [dialogMediaView, setDialogMediaView] = useState<boolean>(false)
    const [viewDocSelected, setViewDocSelected] = useState<{
        data: any
        type: string
    } | null>(null)
    const [openAlertDelete, setOpenAlertDelete] = useState<boolean>(false)
    const router = useRouter()

    const [documentReferenceDialog, setDocumentReferenceDialog] = useState<boolean>(false)

    const [referenceObject, setReferenceObject] = useState<any>({
        equipmentsReferences: [],
        areasReferences: [],
        documentsReferences: []
    })




    const onRefresh = () => {
        setRefreshTable(!refreshTable)
    }

    const onDelete = useCallback(async (document: any) => {
        setOpenAlertDelete(true)
        setDocumentSelected(document)
    }, []);
    const onEdit = useCallback((document: any) => {
        setDocumentSelected(document);
        setDialogOpen(true);
    }, []);
    const onViewDoc = useCallback((document: any) => {

        setDialogMediaView(true)
        const fileExtension = document.file_url.split('.').pop().toLowerCase()
        if (fileExtension === 'pdf') {
            setViewDocSelected((prev: any) => {
                return {
                    ...prev,
                    type: 'document',
                    data: {
                        file_url: document.file_url,
                        type: '',
                        title: document.title
                    }
                }
            })
        } else if (fileExtension === 'mp4' || fileExtension === 'mkv') {
            setViewDocSelected((prev: any) => {
                return {
                    ...prev,
                    type: 'video',
                    data: {
                        file_url: document.file_url,
                        type: '',
                        title: document.title
                    }
                }
            })
        }
    }, []);

    const downloadFile = (file: any) => {
        fetch(`${file.file_url}`).then(response => {
            response.blob().then(blob => {
                const fileURL = window.URL.createObjectURL(blob)
                const linToDownload = document.createElement('a')
                const fileExtension = file.file_url.split('.').pop()
                // Establecer el nombre del archivo con la extensión correcta
                linToDownload.href = fileURL
                linToDownload.download = `${file.title}.${fileExtension}`
                linToDownload.click()
            })
        })
    }
    const onViewDownload = useCallback((document: any) => {

        downloadFile(document);
    }, []);
    const onViewRefs = useCallback((document: any) => {
        setDocumentReferenceDialog(true)
        setDocumentSelected(document);
    }, []);


    const columns = useMemo(() => columnsDocuments({ onEdit, onDelete, onViewDoc, onViewDownload, onViewRefs }), [])



    const delDocument = async () => {
        if (documentSelected !== null) {
            try {
                const response = await deleteDocument(documentSelected.id)
                if (response.status === 200) {
                    router.refresh()

                    setRefreshTable(prevstate => !prevstate)
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
            <DataTable loading={loadingState} columns={columns} data={myData} setPagination={setPage} pagination={page} setMyData={setMyData} />
            {
                dialogOpen && documentSelected !== null ? <DocumentDialog onRefresh={onRefresh} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} setTempFile={() => { }} tempFile={null} id={documentSelected.id} /> : null
            }
            {
                openAlertDelete && documentSelected !== null ? <AlertDeleteDialog open={openAlertDelete} setOpen={setOpenAlertDelete} executeMethod={delDocument} objName={documentSelected.title} /> : null
            }
            {
                dialogMediaView
                    ? <ModalViewMedia setOpen={setDialogMediaView} open={dialogMediaView} information={viewDocSelected} type={String(viewDocSelected?.type)} />
                    : null
            }
            {
                documentReferenceDialog && documentSelected !== null
                    ? <LinkDocumentDialog open={documentReferenceDialog} setOpen={setDocumentReferenceDialog} operationType='edit' setReferenceObject={setReferenceObject} idDocument={Number(documentSelected.id)} />
                    : null
            }
        </div>
    )
}
