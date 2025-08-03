'use client'
import { getImagenesByEquipment } from '@/api/admin/imagenes-api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { ImageType } from './page'

type ImageDetailProps = {
  openDetail: boolean;
  setOpenDetail: (open: boolean) => void;
  images: ImageType | null;
}

const ImageDetail = ({ images, openDetail, setOpenDetail }: ImageDetailProps) => {
  console.log("ImageDetail:", images);
  return (
    <Dialog open={openDetail} onOpenChange={setOpenDetail}>
      <DialogContent className=' bg-gray-200'>
        <DialogHeader>
          <DialogTitle>Imágenes</DialogTitle>
        </DialogHeader>
        <div className='flex flex-row items-center gap-2 overflow-x-auto'>
          {
            images && images.uploaded_files && images.uploaded_files.length > 0 ? (
              images.uploaded_files.map((file, index) => (
                <div
                  key={index}
                  className='flex flex-col gap-1 '
                >
                  <div className='w-[200px] h-[200px] relative rounded-md border-2 border-gray-500 transition-all duration-200 overflow-hidden'>
                    <Image
                      src={file.file}
                      alt={`image-${index + 1}`}
                      layout='fill'
                      objectFit='cover'
                      className='rounded-md'
                    />
                  </div>
                  <span className='text-sm text-center'>Imagen {index + 1}</span>
                </div>
              ))
            ) : (
              <p>No hay archivos subidos.</p>
            )
          }
        </div>

        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}

export default ImageDetail