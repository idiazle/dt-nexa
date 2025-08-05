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
import { getAllImagenes, getImagenesByEquipment } from '@/api/admin/imagenes-api'
import { getEquipments } from '@/api/admin/equipments-api'
import { EquipmentStructure } from '@/lib/utils'
import DialogHistory from './dialog-history'
import DialogEdit from './dialog-edit'

export type ImageType = {
  name: string,
  description: string,
  equipment: string | number,
  uploaded_files: [],
  created_at: string
}

const Imagenes = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [images, setImages] = useState<ImageType[]>([])
  const [openImageDetail, setOpenImageDetail] = useState(false)
  const [openHistory, setOpenHistory] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [imageSelected, setImageSelected] = useState<ImageType | null>(null)
  // Define the EquipmentStructure type or import it if already defined
  // type EquipmentStructure = { id: number; name: string; ... } // Example

  const [equipments, setEquipments] = useState<EquipmentStructure[]>([])

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

  const uniqueLatestByEquipment = (items: { equipment: number; created_at: string }[]) => {
    const latestMap = new Map<number, any>();

    items.forEach(item => {
      const current = latestMap.get(item.equipment);

      if (!current || new Date(item.created_at) > new Date(current.created_at)) {
        latestMap.set(item.equipment, item);
      }
    });

    return Array.from(latestMap.values());
  };

  // console.log("Unique latest images by equipment:", uniqueLatestByEquipment(images));

  useEffect(() => {
    getEquipments()
      .then(response => {
        if (response.status === 200) {
          setEquipments(response.data.data)
        }
      })
      .catch(error => {
        console.error("Error fetching equipments:", error);
      })
  }, [])

  const getEquipmentName = (id: string | number) => {
    const equipment = equipments.find(e => e.equipment_id === id);
    return equipment ? equipment.tag + ' - ' + equipment.name : 'Unknown Equipment';
  };

  useEffect(() => {
    getImagenesByEquipment(16)
      .then(response => {
        if (response.status === 200) {
          console.log("Fetched images by equipment:", response.data.data);
        }
      })
      .catch(error => {
        console.error("Error fetching images by equipment:", error);
      })
  }, [])

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
                  <TableCell>{getEquipmentName(image.equipment)}</TableCell>
                  <TableCell>{image.name}</TableCell>
                  <TableCell>{image.description}</TableCell>
                  {/* <TableCell>{image.file.join(', ')}</TableCell> */}
                  <TableCell className='flex flex-row gap-2'>
                    <Button
                      onClick={() => {
                        setOpenImageDetail(true)
                        setImageSelected(image)
                      }}
                    >
                      Ver imágenes
                    </Button>
                    <Button
                      onClick={() => {
                        setOpenHistory(true)
                        setImageSelected(image)
                      }}
                    >Ver historial</Button>
                    <Button
                      onClick={() => {
                        setOpenEdit(true)
                        setImageSelected(image)
                      }}
                    >Editar info.</Button>
                    <Button variant='destructive'>Eliminar</Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
      {
        openDialog && <CreateImagesEquipments openDialog={openDialog} setOpenDialog={setOpenDialog} />
      }
      {
        openImageDetail && <ImageDetail images={imageSelected} openDetail={openImageDetail} setOpenDetail={setOpenImageDetail} />
      }
      {
        openHistory && <DialogHistory openHistory={openHistory} setOpenHistory={setOpenHistory} image={imageSelected} />
      }
      {
        openEdit && <DialogEdit openEdit={openEdit} setOpenEdit={setOpenEdit} image={imageSelected} />
      }
    </div>
  )
}

export default Imagenes
