import React, { useCallback, useMemo, useState } from 'react'
import DataTable from './data-table'
import { useRouter } from 'next/navigation'
import { PlanStructure } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { columnsPlans } from './columns'

export default function PlansTable() {

    const [selectedPlan, setSelectedPlan] = useState<PlanStructure|null>(null)
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [openAlertDelete, setOpenAlertDelete] = useState<boolean>(false)
    const router = useRouter()

    const onDelete = useCallback(async (user: any) => {
        setOpenAlertDelete(true)
        setSelectedPlan(user)
    }, []);
    const onEdit = useCallback((user: any) => {
        setSelectedPlan(user);
        setDialogOpen(true);
    }, []);

    const delEntity = async () => {
        if (selectedPlan !== null) {
            try {
                const response = await deleteUserById(selectedUser.id)
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

    const columns = useMemo(() => columnsPlans({ onEdit, onDelete }), [])
  return (
    <div>
    <DataTable columns={columns} data={data} />
    {
        dialogOpen && selectedUser !== null ? <UserDialog id={selectedUser.id} setDialogOpen={setDialogOpen} dialogOpen={dialogOpen} /> : null
    }
    {
        openAlertDelete && selectedUser !== null ? <AlertDeleteDialog open={openAlertDelete} setOpen={setOpenAlertDelete} executeMethod={delEntity} objName={selectedUser.name} /> : null
    }
</div>
  )
}
