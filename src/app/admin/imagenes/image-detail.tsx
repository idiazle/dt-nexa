'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import React from 'react'

type ImageDetailProps = {
  openDetail: boolean;
  setOpenDetail: (open: boolean) => void;
}

const ImageDetail = ({ openDetail, setOpenDetail }: ImageDetailProps) => {
  return (
    <Dialog open={openDetail} onOpenChange={setOpenDetail}>
      <DialogContent className='sm:max-w-[425px] bg-gray-200'>
        <DialogHeader>
          <DialogTitle>Detalles de la Imagen</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          {/* Aquí puedes agregar los detalles de la imagen */}
          <p className='bg.white'>Nombre: </p>
          <p>Descripción: </p>
          <p>Equipo: </p>
        </div>
        <Separator className='my-4' />
        <div className='flex flex-col gap-2'>
          <Label>Archivos Subidos:</Label>
        </div>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ImageDetail