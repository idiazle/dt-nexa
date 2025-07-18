import { getEquipments } from '@/api/admin/equipments-api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select'
import React, { useEffect, useState } from 'react'
import type { EquipmentStructure } from '@/lib/utils'
import { postImagenesByEquipment } from '@/api/admin/imagenes-api'

interface CreateImagesEquipmentsProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
}

const CreateImagesEquipments = ({ openDialog, setOpenDialog }: CreateImagesEquipmentsProps) => {
  const [equipments, setEquipments] = useState<EquipmentStructure[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<string>('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [data, setData] = useState<{ name: string; description: string }>({
    name: '',
    description: ''
  })

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setImageFiles(filesArray);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleEquipmentChange = (value: string) => {
    setSelectedEquipment(value);
  };


  const handleUpload = () => {
    const formData = new FormData();
    formData.append('equipment', selectedEquipment);
    formData.append('name', data.name);
    formData.append('description', data.description);
    imageFiles.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    console.log("Form Data to Upload:", formData);
    postImagenesByEquipment(formData)
      .then(response => {
        if (response.status === 201) {
          console.log("Images uploaded successfully:", response.data);
          setSelectedEquipment('');
          setImageFiles([]);
          setData({ name: '', description: '' });
          setOpenDialog(false);
        }
      })
      .catch(error => {
        console.error("Error uploading images:", error);
      });
    // setOpenDialog(false);

  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className='bg-gray-100' >
        <DialogHeader>
          <DialogTitle >SUBIR IMAGEN</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-2'>
          <Label className='font-bold'>Equipo:</Label>
          <Select
            value={selectedEquipment}
            onValueChange={handleEquipmentChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="-- Seleccionar equipo --" />
            </SelectTrigger>
            <SelectContent>
              {equipments.map((equipment) => (
                <SelectItem key={equipment.equipment_id} value={String(equipment.equipment_id)}>
                  {equipment.tag} - {equipment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div>
            <Label className='font-bold'>Imagen:</Label>
            <Input type='file' accept='image/*' multiple onChange={handleFileChange} />
          </div>
          <div>
            <Label className='font-bold'>Nombre:</Label>
            <Input name='name' value={data.name} onChange={handleInputChange} />
          </div>
          <div>
            <Label className='font-bold'>Descipción:</Label>
            <Input name='description' value={data.description} onChange={handleInputChange} />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant='secondary'
            onClick={() => setOpenDialog(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              // Logic to handle image upload
              handleUpload();
            }}
          >
            Subir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateImagesEquipments