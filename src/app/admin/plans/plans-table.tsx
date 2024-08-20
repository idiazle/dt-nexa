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
import ModalViewMedia from '@/components/viewers/modal-viewer'
import ShapesPlanDialog from '@/components/admin/plans/shapes-plan-dialog'


interface PlanTableStructure {
    data: PlanStructure[]
}

export default function PlansTable({ data }: PlanTableStructure) {

    const [planSelected, setPlanSelected] = useState<any>(null)
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [openAlertDelete, setOpenAlertDelete] = useState<boolean>(false)

    const [openViewDoc, setOpenViewDoc] = useState<any>(null)

    const [openShapesPlanDialog, setOpenShapesPlanDialog] = useState<boolean>(false)

    const router = useRouter()
    const [informationView, setInformationView] = useState<{
        data: {
            image: string
            type: string
            name: string
            title: string
            file_url: string
        }
    } | null>(null)


    const onCreateShapes = useCallback(async (plan: any) => {
        setPlanSelected(plan)
        setOpenShapesPlanDialog(true)

    }, [])
    const onViewDocument = useCallback(async (plan: any, type: string) => {

        if (type === 'image') {
            setInformationView({
                data: {
                    image: plan.image,
                    type: 'image',
                    name: plan.name,
                    title: '',
                    file_url: ''
                }
            })
        } else {
            setInformationView({
                data: {
                    image: plan.image,
                    type: 'document',
                    title: plan.name,
                    name: '',
                    file_url: plan.documents[0].document_id.file_url

                }
            })
        }
        setPlanSelected(plan)
        setOpenViewDoc(true)
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

    const columns = useMemo(() => columnsPlans({ onEdit, onDelete, onViewDocument, onCreateShapes }), [])

    return (
        <div>
            <DataTable columns={columns} data={data} />
            {
                dialogOpen && planSelected !== null ? <PlanDialog id={planSelected.id} setDialogOpen={setDialogOpen} dialogOpen={dialogOpen} /> : null
            }
            {
                openAlertDelete && planSelected !== null ? <AlertDeleteDialog open={openAlertDelete} setOpen={setOpenAlertDelete} executeMethod={delEntity} objName={planSelected.name} /> : null
            }
            {
                openViewDoc ? <ModalViewMedia open={openViewDoc} setOpen={setOpenViewDoc} type={String(informationView?.data.type)} information={informationView} /> : null
            }
            {/* {
                openShapesPlanDialog ? <ShapesPlanDialog dialogOpen={openShapesPlanDialog} setDialogOpen={setOpenShapesPlanDialog} planObject={planSelected} /> : null
            } */}
        </div>
    )
}
