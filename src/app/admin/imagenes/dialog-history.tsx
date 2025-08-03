import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react'
import { ImageType } from './page';
import { getImagenesByEquipment } from '@/api/admin/imagenes-api';
import Image from 'next/image';

interface DialogHistoryProps {
  openHistory: boolean;
  setOpenHistory: (open: boolean) => void;
  image?: ImageType | null; // Optional, if you want to pass an image for context
}

const DialogHistory = ({ openHistory, setOpenHistory, image }: DialogHistoryProps) => {
  const [history, setHistory] = useState<any[]>([]);
  console.log("a buscar:", image);

  useEffect(() => {
    if (image) {
      getImagenesByEquipment(Number(image.equipment)).then(response => {
        if (response.status === 200) {
          setHistory(response.data.data);
        }
      }).catch(error => {
        console.error("Error fetching image history:", error);
      });
    }
  }, [image]);

  console.log("history:", history);

  return (
    <Dialog open={openHistory} onOpenChange={setOpenHistory}>
      <DialogContent className='bg-gray-200 max-h-[500px]'>
        <DialogHeader>
          <DialogTitle>Historial de Imágenes</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4 overflow-y-auto'>
          {
            history.length > 0 ? (
              history.map((item, index) => (
                <div key={index} className='p-2 border-b bg-white'>
                  <p><strong>Fecha:</strong> {new Date(item.created_at).toLocaleDateString()}</p>
                  <p><strong>Descripción:</strong> {item.description}</p>
                  <div className='flex flex-wrap gap-2 overflow-x-auto'>
                    {
                      item.uploaded_files.map((file: any, fileIndex: number) => (
                        <Image
                          key={fileIndex}
                          src={file.file}
                          alt={`history-image-${fileIndex}`}
                          width={100}
                          height={100}
                          className='w-32 h-32 object-cover rounded-md'
                        />
                      ))
                    }
                  </div>
                </div>
              ))
            ) : (
              <p>No hay historial de imágenes para este equipo.</p>
            )
          }
        </div>
      </DialogContent>
    </Dialog>

  )
}

export default DialogHistory