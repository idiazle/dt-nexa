'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import EquipmentDialog from './equipment-dialog'


export default function CreateEquipmentBtn() {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    return (
        <div className='flex flex-row justify-between items-center'>
            <h1 className='font-semibold text-2xl'>Equipos(TAGS)</h1>

            <Button onClick={() => { setDialogOpen(true) }}>Crear Equipo</Button>

            {
                dialogOpen ?
                    <EquipmentDialog id={null} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} /> : null
            }
        </div>
    )
}
