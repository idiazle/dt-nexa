'use client'
import { deleteDespiece } from '@/api/admin/despieces-api'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import React, { useCallback, useMemo, useState } from 'react'
import { columnsDespieces } from './columns'
import DespieceDialog from '@/components/admin/despieces/despiece-dialog'
import { DataTable } from './data-table'
import AlertDeleteDialog from '@/components/general/alert-delete-dialog'


export default function DespiecesTable({ data }: { data: any[] }) {


    const [despieceSelected, setDespieceSelected] = useState<any>(null)

    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [openAlertDelete, setOpenAlertDelete] = useState<boolean>(false)
    const router = useRouter()

    const onDelete = useCallback(async (user: any) => {
        setOpenAlertDelete(true)
        setDespieceSelected(user)
    }, []);
    const onEdit = useCallback((user: any) => {
        setDespieceSelected(user);
        setDialogOpen(true);
    }, []);

    const delEntity = async () => {
        if (despieceSelected !== null) {
            try {
                const response = await deleteDespiece(despieceSelected.id)
                if (response.status === 200) {
                    router.refresh()
                    toast({
                        duration: 3000,
                        variant: 'destructive',
                        title: 'Eliminación ',
                        description: 'Usuario eliminado correctamente'
                    })
                }
            } catch (error) {
                throw new Error('Error al eliminar el usuario')
            }
        }
    }

    const columns = useMemo(() => columnsDespieces({ onEdit, onDelete }), [])
    return (
        <div>
            <DataTable columns={columns} data={data} />
            {
                dialogOpen && despieceSelected !== null ? <DespieceDialog id={despieceSelected.id} setDialogOpen={setDialogOpen} dialogOpen={dialogOpen} /> : null
            }
            {
                openAlertDelete && despieceSelected !== null ? <AlertDeleteDialog open={openAlertDelete} setOpen={setOpenAlertDelete} executeMethod={delEntity} objName={despieceSelected.description} /> : null
            }
        </div>
    )
}
