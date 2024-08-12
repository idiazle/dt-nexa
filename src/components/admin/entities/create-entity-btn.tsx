'use client'
import React, { useState } from 'react'
import EntityDialog from './entity-dialog'
import { Button } from '@/components/ui/button'

export default function CreateEntityBtn() {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    return (
        <div className='flex flex-row justify-between items-center'>
            <h1 className='font-semibold text-2xl'>Entidades: Plantas y Áreas</h1>

            <Button onClick={() => { setDialogOpen(true) }}>Crear Entidad</Button>

            {
                dialogOpen ?
                    <EntityDialog id={null} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} /> : null
            }
        </div>
    )
}
