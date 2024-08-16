'use client'

import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import DespieceDialog from './despiece-dialog'

export default function CreateDespieceBtn() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [tempFile, setTempFile] = useState(null)
  return (
    <div className='flex flex-row justify-between items-center'>
      <h1 className='font-semibold text-2xl'>Despieces registrados</h1>

      <Button onClick={() => { setDialogOpen(true) }}>Crear despiece</Button>

      {
        dialogOpen ?
          <DespieceDialog id={null} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} /> : null
      }
    </div>
  )
}
