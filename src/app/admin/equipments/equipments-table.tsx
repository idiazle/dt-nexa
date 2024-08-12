'use client'
import { EntityStructure, EquipmentStructure, Manufacturer } from '@/lib/utils'
import React, { useCallback, useMemo, useState } from 'react'
import { DataTable } from './data-table';
import EntityDialog from '@/components/admin/entities/entity-dialog';
import { deleteEntity } from '@/api/admin/entities-api';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import AlertDeleteDialog from '@/components/general/alert-delete-dialog';
import { columnsEquipments } from './columns';
import EquipmentDialog from '@/components/admin/equipments/equipment-dialog';
import { deleteEquipment } from '@/api/admin/equipments-api';

interface EquipmentTableStructure {
    data: EquipmentStructure[]
    entities: EntityStructure[]
    manufacturers: Manufacturer[]
}
export default function EquipmentsTable({ data, entities, manufacturers }: EquipmentTableStructure) {
    

    const [selectedEquipment, setSelectedEquipment] = useState<EquipmentStructure | null>(null)

    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [openAlertDelete, setOpenAlertDelete] = useState<boolean>(false)
    const router = useRouter()

    const onDelete = useCallback(async (entity: any) => {
        setOpenAlertDelete(true)
        setSelectedEquipment(entity)
    }, []);
    const onEdit = useCallback((entity: any) => {
        console.log(entity);
        
        setSelectedEquipment(entity);
        setDialogOpen(true);
    }, []);

    const delEquipment = async () => {
        if (selectedEquipment !== null) {
            try {
                const response = await deleteEquipment(selectedEquipment.equipment_id)
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

    const columns = useMemo(() => columnsEquipments({ onEdit, onDelete }), [])

    return (
        <div>
            <DataTable columns={columns} data={data} />
            {
                dialogOpen && selectedEquipment !== null ? <EquipmentDialog equipments={data} entities={entities} manufacturers={manufacturers} id={selectedEquipment.equipment_id} setDialogOpen={setDialogOpen} dialogOpen={dialogOpen} /> : null
            }
            {
                openAlertDelete && selectedEquipment !== null ? <AlertDeleteDialog open={openAlertDelete} setOpen={setOpenAlertDelete} executeMethod={delEquipment} objName={selectedEquipment.name} /> : null
            }
        </div>
    )
}
