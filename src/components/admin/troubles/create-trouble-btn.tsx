'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import TroubleDialog from './trouble-dialog'

export default function CreateTroubleBtn() {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    return (
        <div className='flex flex-row justify-between items-center'>
            <h1 className='font-semibold text-2xl'>Usuarios registrados</h1>

            <Button onClick={() => { setDialogOpen(true) }}>Crear Usuario</Button>

            {
                dialogOpen ?
                    <TroubleDialog/> : null
            }
        </div>
    )
}
