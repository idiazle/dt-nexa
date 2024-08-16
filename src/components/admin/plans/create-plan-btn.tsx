'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import PlanDialog from './plan-dialog'

export default function CreatePlanBtn() {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    return (
        <div className='flex flex-row justify-between items-center'>
            <h1 className='font-semibold text-2xl'>Planos registrados</h1>

            <Button onClick={() => { setDialogOpen(true) }}>Crear plano</Button>

            {
                dialogOpen ?
                    <PlanDialog id={null} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} /> : null
            }
        </div>
    )
}
