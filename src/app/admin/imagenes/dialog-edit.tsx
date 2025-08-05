import React, { useEffect, useState } from 'react'
import { ImageType } from './page';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getImagenesByEquipment, putImagenesByEquipment } from '@/api/admin/imagenes-api';
import Image from 'next/image';
import { FaTrash } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';

interface DialogEditProps {
  openEdit: boolean;
  setOpenEdit: (open: boolean) => void;
  image: ImageType | null; // Assuming ImageType is defined in the same way as
}

const DialogEdit = ({ openEdit, setOpenEdit, image }: DialogEditProps) => {
  const [data, setData] = useState({
    id: 0,
    name: '',
    description: '',
    created_at: '',
    uploaded_files: []
  })
  interface UploadedFile {
    id: number;
    file: string; // URL or path to the image
    [key: string]: any; // for any additional properties
  }

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    if (image) {
      getImagenesByEquipment(Number(image.equipment)).then(response => {
        if (response.status === 200) {
          const responseData = response.data.data
          setData(responseData[responseData.length - 1])
          setUploadedFiles(responseData[responseData.length - 1].uploaded_files || []);
        }
      }).catch(error => {
        console.error(error);
      });
    }
  }, [image]);

  const handleDeleteImage = (fileId: number) => {
    setUploadedFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
  };

  async function urlToFile(url: string, filename: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('equipment', String(image?.equipment));

    // Convertir URLs a archivos reales
    // Revisar el codigo para actualizar los archivos subidos y agregar tambien nuevos archivos si es necesario
    const filesPromises = uploadedFiles.map(async (item, index) => {
      const file = await urlToFile(item.file, `image_${index}.png`);
      formData.append(`files[${index}]`, file);
    });

    // Esperar a que se resuelvan todas las promesas
    await Promise.all(filesPromises);

    putImagenesByEquipment(data?.id, formData).then(response => {
      if (response.status === 200) {
        console.log("Image updated successfully:", response.data);
        setOpenEdit(false);
      }
    }).catch(error => {
      console.error("Error updating image:", error);
    });
  }

  return (
    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
      <DialogContent className='bg-gray-200 max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Editar</DialogTitle>
        </DialogHeader>
        <div>
          <div>
            <Label className='font-bold'>Fecha de creacion:</Label>
            <Input disabled value={data?.created_at} />
          </div>
          <div>
            <Label className='font-bold'>Nombre:</Label>
            <Input value={data?.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
          </div>
          <div>
            <Label className='font-bold'>Descripción:</Label>
            <Input value={data?.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
          </div>
          <div className='w-[460px]'>
            <Label className='font-bold'>Imágenes:</Label>
            <div className='flex flex-row gap-2 overflow-x-auto p-4 bg-white rounded-md'>
              {
                uploadedFiles && uploadedFiles.length > 0 ? (
                  uploadedFiles.map((file, index) => (
                    <div key={index} className='flex-shrink-0 cursor-pointer justify-center items-center flex flex-col gap-1'>
                      <div className='w-[200px] h-[200px] relative rounded-md border-2 border-gray-500 transition-all duration-200 overflow-hidden'>
                        <Image
                          src={file.file}
                          alt={`image-${index + 1}`}
                          layout='fill'
                          objectFit='cover'
                          className='rounded-md'
                        />
                        <FaTrash className='absolute top-2 right-2 text-red-500 cursor-pointer' onClick={() => handleDeleteImage(file.id)} />
                      </div>
                      <span className='text-sm text-center'>Imagen {index + 1}</span>
                    </div>
                  ))
                ) : (
                  <span className='text-sm text-center'>No hay imágenes disponibles</span>
                )
              }
              {/* <div>
                <Input type='file' accept='image/*' onChange={handleFileChange} multiple />
              </div> */}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant='destructive'
            onClick={() => setOpenEdit(false)}
          >
            Cancelar
          </Button>
          <Button onClick={() => { handleSubmit() }}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogEdit