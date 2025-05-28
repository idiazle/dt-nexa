'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import IconDialog from './icon-dialog'

export const BtnCreateIcon = () => {
    const [dialogOpen, setDialogOpen] = useState(false)
    return (
        <div className='flex flex-row justify-between items-center'>
            <h1 className='font-semibold text-2xl'>Iconos</h1>

            <Button onClick={() => { setDialogOpen(true) }}>Crear Icono</Button>

            {
                dialogOpen ?
                    <IconDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} /> : null
            }
        </div>
    )
}
