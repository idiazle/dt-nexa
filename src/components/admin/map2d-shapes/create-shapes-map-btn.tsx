'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import Map2dShapesDialog from './map2d-shapes-dialog'

export default function CreateShapesMapBtn() {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    return (
        <div className='flex flex-row justify-between items-center'>
            <h1 className='font-semibold text-2xl'>Mapas2d</h1>

            <Button onClick={() => { setDialogOpen(true) }}>Crear Mapa</Button>
            {
                dialogOpen ?
                    <Map2dShapesDialog id={null} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} /> : null
            }
        </div>
    )
}
