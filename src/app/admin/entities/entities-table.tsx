'use client'
import { EntityStructure } from '@/lib/utils'
import React, { useCallback, useMemo, useState } from 'react'
import { DataTable } from './data-table';
import { columnsEntities } from './columns';
import EntityDialog from '@/components/admin/entities/entity-dialog';
import { deleteEntity } from '@/api/admin/entities-api';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import AlertDeleteDialog from '@/components/general/alert-delete-dialog';

interface EntitiesTableStructure {
    data: EntityStructure[]
}
export default function EntitiesTable({ data }: EntitiesTableStructure) {


    const [selectedEntity, setSelectedEntity] = useState<any>(null)
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [openAlertDelete, setOpenAlertDelete] = useState<boolean>(false)
    const router = useRouter()

    const onDelete = useCallback(async (entity: any) => {
        setOpenAlertDelete(true)
        setSelectedEntity(entity)
    }, []);
    const onEdit = useCallback((entity: any) => {
        setSelectedEntity(entity);
        setDialogOpen(true);
    }, []);

    const delEntity = async () => {
        try {
            const response = await deleteEntity(selectedEntity.id)
            if (response.status === 200) {
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

    const columns = useMemo(() => columnsEntities({ onEdit, onDelete }), [])

    return (
        <div>
            <DataTable columns={columns} data={data} />
            {
                dialogOpen ? <EntityDialog id={selectedEntity.id} setDialogOpen={setDialogOpen} dialogOpen={dialogOpen} /> : null
            }
            {
                openAlertDelete ? <AlertDeleteDialog open={openAlertDelete} setOpen={setOpenAlertDelete} executeMethod={delEntity} objName={selectedEntity.name}/> : null
            }
        </div>
    )
}
