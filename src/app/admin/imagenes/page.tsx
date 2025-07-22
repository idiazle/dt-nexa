'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { useEffect, useState } from 'react'
import ImageDetail from './image-detail'
import CreateImagesEquipments from '@/components/admin/imagenes/create-imagenes'
import { getAllImagenes } from '@/api/admin/imagenes-api'
import { getEquipments } from '@/api/admin/equipments-api'

type Image = {
  name: string,
  description: string,
  equipment: string | number,
  uploaded_files: []
}

const Imagenes = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [images, setImages] = useState<Image[]>([])
  const [openImageDetail, setOpenImageDetail] = useState(false)
  const [imageSelected, setImageSelected] = useState<Image | null>(null)
  const [equipments, setEquipments] = useState([])

  useEffect(() => {
    if (openDialog === false) {
      getAllImagenes()
        .then(response => {
          if (response.status === 200) {
            setImages(response.data.data)
          }
        })
        .catch(error => {
          console.error("Error fetching images:", error);
        })
    }
  }, [openDialog]);

  console.log("Images after fetch:", images);

  return (
    <div>
      <div className='flex flex-row justify-between items-center'>
        <h1 className='text-lg font-bold'>Gestión de Imágenes</h1>
        <Button
          onClick={() => {
            setOpenDialog(true)
            // Logic to handle image upload
          }}
        >
          Subir Imagen
        </Button>
      </div>
      <Separator className='my-4' />
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N°</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              images.map((image, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{image.equipment}</TableCell>
                  <TableCell>{image.name}</TableCell>
                  <TableCell>{image.description}</TableCell>
                  {/* <TableCell>{image.file.join(', ')}</TableCell> */}
                  <TableCell className='flex flex-row gap-2'>
                    <Button
                      onClick={() => {
                        setOpenImageDetail(true)
                        // setImageSelected(image)
                      }}
                    >
                      Ver imágenes
                    </Button>
                    <Button disabled>Ver historial</Button>
                    <Button disabled>Editar info.</Button>
                    <Button variant='destructive'>Eliminar</Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
      {
        openDialog && (
          <CreateImagesEquipments
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
          />
        )
      }
      {
        openImageDetail && (
          <ImageDetail
            openDetail={openImageDetail}
            setOpenDetail={setOpenImageDetail}
          />
        )
      }
    </div>
  )
}

export default Imagenes
