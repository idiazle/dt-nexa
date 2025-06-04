'use client'
import { Map2dShapesStructure } from '@/lib/utils'
import React, { useCallback, useMemo, useState } from 'react'
import { DataTable } from './data-table'
import { columnsMapShapes2d } from './columns'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import AlertDeleteDialog from '@/components/general/alert-delete-dialog'
import { deleteMapShape2dById } from '@/api/admin/maps2d-api'

interface Map2dShapesTableStructure {
    data: Map2dShapesStructure[]
}

export default function Maps2dShapesTable({ data }: Map2dShapesTableStructure) {

    const [selectedMapShape, setSelecteMapShape] = useState<Map2dShapesStructure | null>(null)
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [openAlertDelete, setOpenAlertDelete] = useState<boolean>(false)
    const router = useRouter()

    const onDelete = useCallback(async (map2d: any) => {
        setOpenAlertDelete(true)
        setSelecteMapShape(map2d)
    }, []);
    const onEdit = useCallback((map2d: any) => {
        setSelecteMapShape(map2d);
        setDialogOpen(true);
    }, []);

    const delEntity = async () => {
        if (selectedMapShape !== null) {
            try {
                const response = await deleteMapShape2dById(Number(selectedMapShape.id))
                if (response.status === 200) {
                    router.refresh()
                    toast({
                        duration: 3000,
                        variant: 'destructive',
                        title: 'Eliminación ',
                        description: 'MapaShape eliminado correctamente'
                    })
                }
            } catch (error) {
                throw new Error('Error al eliminar el mapa')
            }
        }
    }

    const columns = useMemo(() => columnsMapShapes2d({ onEdit, onDelete }), [])
    return (
        <div>
            <DataTable columns={columns} data={data} />
            {/* {
                dialogOpen && selectedMapShape !== null ? <Map2dDialog id={selectedMapShape.id} setDialogOpen={setDialogOpen} dialogOpen={dialogOpen} /> : null
            } */}
            {
                openAlertDelete && selectedMapShape !== null ? <AlertDeleteDialog open={openAlertDelete} setOpen={setOpenAlertDelete} executeMethod={delEntity} objName={String(selectedMapShape.id)} /> : null
            }
        </div>
    )
}
