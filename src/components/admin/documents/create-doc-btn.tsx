
'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import DocumentDialog from './document-dialog'

export default function CreateDocBtn() {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [tempFile, setTempFile] = useState(null)

    return (
        <div className='flex flex-row justify-between items-center'>
            <h1 className='font-semibold text-2xl'>Documentos registrados</h1>

            <Button onClick={() => { setDialogOpen(true) }}>Crear documento</Button>

            {
                dialogOpen ?
                    <DocumentDialog onRefresh={() => { }} tempFile={tempFile} setTempFile={setTempFile} id={null} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} /> : null
            }
        </div>
    )
}
