'use client'
import { Map2dStructure, PhotogrametryStructure } from '@/lib/utils'
import React, { useCallback, useMemo, useState } from 'react'
import { DataTable } from './data-table'
import { columnsNodes360Photos } from './columns'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import AlertDeleteDialog from '@/components/general/alert-delete-dialog'
import { deleteMapPlans2d } from '@/api/admin/maps2d-api'
import Map2dDialog from '@/components/admin/maps2d/map2d-dialog'
import { deleteNode360ById } from '@/api/admin/nodes360-api'
import Nodes360Dialog from '@/components/admin/nodes360/nodes360-dialog'
import Node360Viewer from '@/components/admin/nodes360/node360-viewer'

interface Nodes360TableStructure {
    data: PhotogrametryStructure[]
}

export default function Nodes360PhotoTable({ data }: Nodes360TableStructure) {

    const [selectedNode360, setSelectedNode360] = useState<PhotogrametryStructure | null>(null)
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [dialog360Open, setDialog360Open] = useState<boolean>(false)
    const [openAlertDelete, setOpenAlertDelete] = useState<boolean>(false)
    const router = useRouter()

    const onDelete = useCallback(async (map2d: any) => {
        setOpenAlertDelete(true)
        setSelectedNode360(map2d)
    }, []);
    const onEdit = useCallback((map2d: any) => {
        setSelectedNode360(map2d);
        setDialogOpen(true);
    }, []);

    const onView360 = useCallback((map2d: any) => {
        setSelectedNode360(map2d);
        setDialog360Open(true);
        console.log("WDKAO", map2d);
    }, []);

    const delEntity = async () => {
        if (selectedNode360 !== null) {
            try {
                const response = await deleteNode360ById(selectedNode360.id)
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


    const columns = useMemo(() => columnsNodes360Photos({ onEdit, onDelete, onView360 }), [])


    return (
        <div>
            <DataTable columns={columns} data={data} />
            {
                dialogOpen && selectedNode360 !== null ? <Nodes360Dialog id={selectedNode360.id} setDialogOpen={setDialogOpen} dialogOpen={dialogOpen} /> : null
            }
            {
                openAlertDelete && selectedNode360 !== null ? <AlertDeleteDialog open={openAlertDelete} setOpen={setOpenAlertDelete} executeMethod={delEntity} objName={selectedNode360.name} /> : null
            }
            {
                dialog360Open ? <Node360Viewer allNodes={data} selectedNode={selectedNode360} dialogOpen={dialog360Open} setDialogOpen={setDialog360Open} /> : null
            }
        </div>
    )
}
