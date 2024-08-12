
'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import DocumentDialog from './document-dialog'

export default function CreateDocBtn() {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    return (
        <div className='flex flex-row justify-between items-center'>
            <h1 className='font-semibold text-2xl'>Usuarios registrados</h1>

            <Button onClick={() => { setDialogOpen(true) }}>Crear Usuario</Button>

            {
                dialogOpen ?
                    <DocumentDialog /> : null
            }
        </div>
    )
}
