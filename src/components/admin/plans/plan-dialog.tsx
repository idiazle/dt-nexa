import React from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import PlanCreateForm from './plan-create-form'

interface PlanDialogStructure {
    id: number | null
    dialogOpen: boolean
    setDialogOpen: (value: boolean) => void
}

export default function PlanDialog({ id, dialogOpen, setDialogOpen }: PlanDialogStructure) {
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

            <DialogContent className="sm:max-w-lg max-h-[95vh] overflow-hidden min-w-[70vw] flex flex-col w-full h-full">
                <DialogHeader className='flex flex-row justify-between items-center mt-5'>
                    <DialogTitle>Información del plano</DialogTitle>
                </DialogHeader>
                <Separator />
                {
                    dialogOpen
                        ? <div className='flex flex-col justify-center items-center w-full h-full overflow-auto'>
                            <PlanCreateForm id={id} setDialogOpen={setDialogOpen} />
                        </div>
                        : null
                }
            </DialogContent>
        </Dialog>
    )
}
