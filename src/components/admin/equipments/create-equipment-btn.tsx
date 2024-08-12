'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import EquipmentDialog from './equipment-dialog'
import { EntityStructure, EquipmentStructure, Manufacturer } from '@/lib/utils'

interface CreateEquipmentBtnStructure {
    entities: EntityStructure[] | null
    manufacturers: Manufacturer[] | null
    equipments: EquipmentStructure[] | null
}

export default function CreateEquipmentBtn({entities, manufacturers, equipments}:CreateEquipmentBtnStructure) {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    return (
        <div className='flex flex-row justify-between items-center'>
            <h1 className='font-semibold text-2xl'>Equipos(TAGS)</h1>

            <Button onClick={() => { setDialogOpen(true) }}>Crear Equipo</Button>

            {
                dialogOpen ?
                    <EquipmentDialog entities={entities} equipments={equipments} manufacturers={manufacturers} id={null} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} /> : null
            }
        </div>
    )
}
