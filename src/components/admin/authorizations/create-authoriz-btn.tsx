'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import AuthorizationDialog from './authorization-dialog'

export default function CreateAuthorizBtn() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  return (
    <div className='flex flex-row justify-between items-center'>
      <h1 className='font-semibold text-2xl'>Usuarios registrados</h1>

      <Button onClick={() => { setDialogOpen(true) }}>Crear Usuario</Button>

      {
        dialogOpen ?
          <AuthorizationDialog id={null} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} /> : null
      }
    </div>
  )
}
