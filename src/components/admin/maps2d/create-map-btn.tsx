'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import Map2dDialog from './map2d-dialog'

export default function CreateMapBtn() {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    return (
        <div className='flex flex-row justify-between items-center'>
            <h1 className='font-semibold text-2xl'>Mapas2d</h1>

            <Button onClick={() => { setDialogOpen(true) }}>Crear Mapa</Button>
            {
                dialogOpen ?
                    <Map2dDialog id={null} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} /> : null
            }
        </div>
    )
}
