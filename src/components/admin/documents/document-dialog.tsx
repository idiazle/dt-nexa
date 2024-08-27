import React from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import FormDocDialog from './form-doc-dialog'

interface DocumentDialogStructure {
  id: number | null
  dialogOpen: boolean
  setDialogOpen: (value: boolean) => void
  tempFile: any
  setTempFile: (value: any) => void
  onRefresh: () => void
}

export default function DocumentDialog({ id, onRefresh, dialogOpen, setDialogOpen, tempFile, setTempFile }: DocumentDialogStructure) {
  
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="min-w-[98vw] min-h-[98vh]">
        <DialogHeader>
          <DialogTitle>{id === null ? 'Crear' : 'Editar'} documento</DialogTitle>
        </DialogHeader>
        {
          <FormDocDialog onRefresh={onRefresh} id={id} setTempFile={setTempFile} tempFile={tempFile} setDialogOpen={setDialogOpen} />
        }
      </DialogContent>

    </Dialog>
  )
}
