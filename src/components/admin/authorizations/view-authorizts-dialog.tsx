import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
  } from '@/components/ui/dialog'
  

interface ViewAuthorizationDialogStructure {
    viewAuthorizationDialog: {
      open: boolean
      data: any
    } | null
    setViewAuthorizationDialog: (
      viewAuthorizationDialog: any
    ) => void
  }

export default function ViewAuthoriztsDialog({viewAuthorizationDialog, setViewAuthorizationDialog}:ViewAuthorizationDialogStructure) {
    return (
        <Dialog open={viewAuthorizationDialog?.open} onOpenChange={(value) => { setViewAuthorizationDialog({ ...viewAuthorizationDialog, open: value }) }}>
            <DialogContent className="max-h-[95vh] overflow-auto max-w-[90vw]">
                <DialogHeader>
                    <DialogTitle>Grupo: {viewAuthorizationDialog?.data.name}</DialogTitle>
                    <DialogDescription className='flex flex-row gap-5'>
                        <p>Se muestra el listado de permisos que posee el grupo elegido:</p>
                        <p>C: Crear</p>
                        <p>R: Leer/Ver</p>
                        <p>U: Actualizar</p>
                        <p>D: Eliminar</p>
                    </DialogDescription>
                </DialogHeader>
                <h1 className='w-full text-center border-b-2 pb-3'>Listado de permisos por grupo</h1>
                <div className='grid grid-cols-8 gap-3'>
                    {
                        viewAuthorizationDialog?.data.user_permissions.map((obj: any, index: number) => {
                          const permAdd = obj.crud_perm.add === true ? 'C.' : ''
                          const permChange = obj.crud_perm.change === true ? 'U.' : ''
                          const permDelete = obj.crud_perm.delete === true ? 'D.' : ''
                          const permView = obj.crud_perm.view === true ? 'R' : ''
                          const totalPerm = permAdd + permChange + permDelete + permView
                          return (
                                <div key={index} className='flex flex-col justify-center items-center border-2 px-2'>
                                    <p className='border-b-2 w-full text-center'>{index + 1}</p>
                                    <div className='mt-2'>
                                        <p> Modelo: {obj.model.replaceAll('"', '')}</p>
                                        <p> Permisos: {totalPerm}</p>
                                    </div>
                                </div>
                          )
                        })
                    }
                </div>
            </DialogContent>
        </Dialog>
  )
}
