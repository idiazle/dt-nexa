'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import UserDialog from './user-dialog'

export default function CreateUserBtn() {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    return (
        <div className='flex flex-row justify-between items-center'>
            <h1 className='font-semibold text-2xl'>Usuarios registrados</h1>

            <Button onClick={() => { setDialogOpen(true) }}>Crear Usuario</Button>

            {
                dialogOpen ?
                    <UserDialog id={null} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} /> : null
            }
        </div>
    )
}
