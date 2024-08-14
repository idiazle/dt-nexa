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
  setRefreshTable: (value: boolean) => void

}

export default function DocumentDialog({ id, dialogOpen, setDialogOpen, tempFile, setTempFile, setRefreshTable }: DocumentDialogStructure) {


  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="min-w-[98vw] min-h-[98vh]">
        <DialogHeader>
          <DialogTitle>{id === null ? 'Crear' : 'Editar'} documento</DialogTitle>
        </DialogHeader>
        {
          <FormDocDialog setRefreshTable={setRefreshTable} id={id} setTempFile={setTempFile} tempFile={tempFile} setDialogOpen={setDialogOpen} />
        }
        {/* <DialogFooter className="w-full h-full">
          <div className='flex flex-row justify-end items-center gap-3 w-full'>
            <Button onClick={() => { console.log("aw") }} className='w-1/5' type="button" variant="secondary" >
              {id === null ? 'Guardar' : 'Editar'}
            </Button>
            <Button onClick={() => { setDialogOpen(false) }} className='w-1/5' type="button" variant="secondary">
              Cerrar
            </Button>
          </div>
        </DialogFooter> */}
      </DialogContent>

    </Dialog>
  )
}
