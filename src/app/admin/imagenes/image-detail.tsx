'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
          <p className='bg.white'>Nombre: Imagen 1</p>
          <p>Descripción: Esta es una imagen de ejemplo.</p>
          <p>Equipo: Equipo 1</p>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpenDetail(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ImageDetail