'use client'
import React, { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlanStructure } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { columnsPlans } from './columns'
import { deletePlanById } from '@/api/admin/plan-api'
import PlanDialog from '@/components/admin/plans/plan-dialog'
import AlertDeleteDialog from '@/components/general/alert-delete-dialog'
import { DataTable } from './data-table'


interface PlanTableStructure {
    data: PlanStructure[]
}

export default function PlansTable({ data }: PlanTableStructure) {

    const [planSelected, setPlanSelected] = useState<any>(null)
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [openAlertDelete, setOpenAlertDelete] = useState<boolean>(false)
    const router = useRouter()

    const onViewDocument = useCallback(async (plan: any, type: string) => {
        setOpenAlertDelete(true)
        setPlanSelected(plan)
    }, []);

    const onDelete = useCallback(async (plan: any) => {
        setOpenAlertDelete(true)
        setPlanSelected(plan)
    }, []);
    const onEdit = useCallback((plan: any) => {
        setPlanSelected(plan);
        setDialogOpen(true);
    }, []);

    const delEntity = async () => {
        if (planSelected !== null) {
            try {
                const response = await deletePlanById(planSelected.id)
                if (response.status === 200) {
                    router.refresh()
                    toast({
                        duration: 3000,
                        variant: 'destructive',
                        title: 'Eliminación ',
                        description: 'Plan eliminado correctamente'
                    })
                }
            } catch (error) {
                throw new Error('Error al eliminar el usuario')
            }
        }
    }

    const columns = useMemo(() => columnsPlans({ onEdit, onDelete, onViewDocument }), [])
    
    return (
        <div>
            <DataTable columns={columns} data={data} />
            {
                dialogOpen && planSelected !== null ? <PlanDialog id={planSelected.id} setDialogOpen={setDialogOpen} dialogOpen={dialogOpen} /> : null
            }
            {
                openAlertDelete && planSelected !== null ? <AlertDeleteDialog open={openAlertDelete} setOpen={setOpenAlertDelete} executeMethod={delEntity} objName={planSelected.name} /> : null
            }
        </div>
    )
}
