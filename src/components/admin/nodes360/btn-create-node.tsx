'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import Nodes360Dialog from './nodes360-dialog'

export const BtnCreateNode = () => {
    const [dialogOpen, setDialogOpen] = useState(false)
    return (
        <div className='flex flex-row justify-between items-center'>
            <h1 className='font-semibold text-2xl'>Nodos 360</h1>

            <Button onClick={() => { setDialogOpen(true) }}>Crear Nodo</Button>

            {
                dialogOpen ?
                    <Nodes360Dialog id={null} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} /> : null
            }
        </div>
    )
}
