'use client'
import { Map2dStructure } from '@/lib/utils'
import React, { useCallback, useMemo, useState } from 'react'
import { DataTable } from './data-table'
import { columnsMap2d } from './columns'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import AlertDeleteDialog from '@/components/general/alert-delete-dialog'
import { deleteMapPlans2d } from '@/api/admin/maps2d-api'
import Map2dDialog from '@/components/admin/maps2d/map2d-dialog'

interface Map2dTableStructure {
    data: Map2dStructure[]
}

export default function Maps2dTable({ data }: Map2dTableStructure) {

    const [selectedMap2d, setSelectedMap2d] = useState<Map2dStructure | null>(null)
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [openAlertDelete, setOpenAlertDelete] = useState<boolean>(false)
    const router = useRouter()

    const onDelete = useCallback(async (map2d: any) => {
        setOpenAlertDelete(true)
        setSelectedMap2d(map2d)
    }, []);
    const onEdit = useCallback((map2d: any) => {
        setSelectedMap2d(map2d);
        setDialogOpen(true);
    }, []);



    const delEntity = async () => {
        if (selectedMap2d !== null) {
            try {
                const response = await deleteMapPlans2d(selectedMap2d.id)
                if (response.status === 200) {
                    router.refresh()
                    toast({
                        duration: 3000,
                        variant: 'destructive',
                        title: 'Eliminación ',
                        description: 'Mapa eliminado correctamente'
                    })
                }
            } catch (error) {
                throw new Error('Error al eliminar el mapa')
            }
        }
    }

    const columns = useMemo(() => columnsMap2d({ onEdit, onDelete}), [])
    return (
        <div>
            <DataTable columns={columns} data={data} />
            {
                dialogOpen && selectedMap2d !== null ? <Map2dDialog id={selectedMap2d.id} setDialogOpen={setDialogOpen} dialogOpen={dialogOpen} /> : null
            }
            {
                openAlertDelete && selectedMap2d !== null ? <AlertDeleteDialog open={openAlertDelete} setOpen={setOpenAlertDelete} executeMethod={delEntity} objName={selectedMap2d.name} /> : null
            }
        </div>
    )
}
