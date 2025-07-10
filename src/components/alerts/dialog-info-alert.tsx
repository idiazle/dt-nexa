import React, { use, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { getEquipments } from '@/api/admin/equipments-api'
import { getUsers } from '@/api/admin/users-api'
import Image from 'next/image'
import Link from 'next/link'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Textarea } from '../ui/textarea'
import { EntityStructure, UserStructure } from '@/lib/utils'
import { getEntities } from '@/api/admin/entities-api'
import { useSession } from 'next-auth/react'
// import { postNotification, putNotificationById } from '@/api/admin/notifications-api'

interface DialogInfoNotifyStruct {
  open: boolean
  setOpen: (value: boolean) => void
  dataSelected: any
}

export default function DialogInfoNotify({ open, setOpen, dataSelected }: DialogInfoNotifyStruct) {
  const [data, setData] = useState<any>({ ...dataSelected })
  const { data: session } = useSession()
  const [areas, setAreas] = useState<EntityStructure[] | null>(null)
  const [equipments, setEquipments] = useState<any[] | null>(null)
  const [users, setUsers] = useState<UserStructure[] | null>(null)
  const [editNotify, setEditNotify] = useState<boolean>(false)
  const [areaSelected, setAreaSelected] = useState<string>('')
  const [equipmentSelected, setEquipmentSelected] = useState<string>('')
  // const [typeNotify, setTypeNotify] = useState<string>('1')
  const [creatorName, setCreatorName] = useState<string>('')
  const [sendToName, setSendToName] = useState<string>('')
  const [solutionMessage, setSolutionMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const getInformation = async () => {
    try {
      const responseAreas = await getEntities()
      const responseEquipments = await getEquipments()
      const responseUsers = await getUsers()
      setAreas(responseAreas.data.data)
      setEquipments(responseEquipments.data.data)
      setUsers(responseUsers.data.data as UserStructure[])
    } catch (error) {

    }
  }

  useEffect(() => {
    getInformation()
  }, [])

  console.log('dataSelected', dataSelected)

  const nameArea = (id: string) => {
    areas?.map((obj) => {
      if (String(obj.id) === id) {
        setAreaSelected(obj.name)
      }
    })
  }

  useEffect(() => {
    nameArea(String(dataSelected.inspection_data?.entity_id))
  }, [areas, dataSelected])

  const nameEquipment = (id: string) => {
    equipments?.map((obj) => {
      if (String(obj.level_id) === id) {
        setEquipmentSelected(obj.name)
      }
    })
  }

  // revisar si es correcto o no
  useEffect(() => {
    nameEquipment(String(dataSelected.equipment_id))
  }, [equipments, dataSelected])

  const nameCreator = (id: string) => {
    users?.map((obj) => {
      if (String(obj.id) === id) {
        setCreatorName(obj.name)
      }
    })
  }

  const nameSendTo = (id: string) => {
    users?.map((obj) => {
      if (String(obj.id) === id) {
        setSendToName(obj.short_name)
      }
    })
  }

  useEffect(() => {
    nameCreator(String(dataSelected.creator_id))
    nameSendTo(String(dataSelected.send_to_id))
  }, [users, dataSelected])

  // const handleTypeNotify = (id: any) => {
  //   if (id === 1) {
  //     setTypeNotify('1')
  //   } else {
  //     setTypeNotify('2')
  //   }
  // }

  // useEffect(() => {
  //   handleTypeNotify(dataSelected.inspection_data?.inspection_type)
  // }, [dataSelected])

  // console.log("dataSelected", dataSelected)

  // const submitFData = async () => {
  //   setLoading(true)
  //   delete data.send_to_extra
  //   const newData = { ...data }
  //   const temp = {
  //     ...newData,
  //     message: `${newData.message}\n${session?.user.short_name}: ${solutionMessage}`,
  //   }

  //   const resp = await putNotificationById(Number(data.id), temp)
  //   if (resp.status === 200) {
  //     setLoading(false)
  //     setOpen(false)
  //     console.log('Notificación actualizada', resp)
  //   }
  // }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] bg-gray-200 flex flex-col overflow-auto">
        <DialogHeader>
          <DialogTitle>{data.title}</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col w-full justify-center items-center '>
          <div className='flex flex-row gap-5 w-full h-full'>
            <div className='flex flex-col w-1/3 gap-3 my-2'>
              <Label>Tipo de notificación:</Label>
              <RadioGroup
                disabled
                className='flex flex-row gap-3 w-full pt-3'
                value={String(data.inspection_data?.inspection_type)}
              >
                <div className='flex flex-row gap-2 w-1/2'>
                  <RadioGroupItem value='1' id='1' />
                  <Label>Area</Label>
                </div>
                <div className='flex flex-row gap-2 w-1/2'>
                  <RadioGroupItem value='2' id='2' />
                  <Label>Equipo</Label>
                </div>
              </RadioGroup>
            </div>
            <div className='flex flex-col justify-center items-start w-2/3 gap-3 my-2'>
              <Label>Área/Equipo:</Label>
              <Input disabled value={areaSelected} />
            </div>
          </div>

          <div className='flex flex-row gap-5 w-full'>
            <div className='flex flex-col justify-center items-start w-1/2 gap-3 my-2'>
              <Label>Estado:</Label>
              <Select
                disabled={!editNotify}
                value={String(data.status)}
                onValueChange={(value) => {
                  setData({
                    ...data,
                    status: Number(value)
                  })
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">No atendido</SelectItem>
                    <SelectItem value="0">Atendido</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col justify-center items-start w-1/2 gap-3 my-2'>
              <Label>Prioridad</Label>
              <Select disabled value={String(data.priority)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione la prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">Muy Alta</SelectItem>
                    <SelectItem value="2">Alta</SelectItem>
                    <SelectItem value="3">Media</SelectItem>
                    <SelectItem value="4">Baja</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
            <Label>Creado por:</Label>
            <Input disabled value={creatorName} />
          </div>
          <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
            <Label>Enviado a:</Label>
            <Input disabled value={sendToName} />
          </div>
          <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
            <Label>Mensaje:</Label>
            <Textarea className='resize-none' disabled={true} value={data.message} />
          </div>
          {
            editNotify
              ? <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
                <Label>Solución:</Label>
                <Textarea
                  className='resize-none'
                  value={solutionMessage}
                  onChange={(value) => {
                    setSolutionMessage(String(value.target.value))
                  }}
                />
              </div>
              : null
          }
          <div className='flex flex-col justify-center items-start w-full my-2 '>
            <Label>Evidencias:</Label>
            <div className='flex flex-col justify-center items-start w-[450px] h-[160px] overflow-x-auto gap-1'>
              <div className='flex flex-row gap-2'>
                {dataSelected?.uploaded_files?.map((img: any, indexFile: number) => (
                  <Dialog key={indexFile}>
                    <DialogTrigger asChild>
                      <div className='relative h-[125px] w-[125px]'>
                        <Image
                          src={img.file}
                          alt={img.id || ''}
                          style={{
                            objectFit: 'cover'
                          }}
                          fill
                        />
                      </div>

                    </DialogTrigger>
                    <DialogContent className="max-w-7xl border-0 bg-transparent p-0">
                      <div className="relative h-[calc(100vh-220px)] w-full overflow-clip rounded-md bg-transparent shadow-md">
                        <Image src={img.file} fill alt={img.id || ''} className="h-full w-full object-contain" />
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={!editNotify}
            // onClick={() => { submitFData() }}
            >
            Guardar
          </Button>
          <Button
            disabled={data.send_to_id !== session?.user.id && data.send_to_id !== null}
            onClick={() => { setEditNotify(!editNotify) }}>
            {editNotify ? 'Cancelar' : 'Actualizar'}
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}
