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
import { FaAngleDoubleRight } from 'react-icons/fa'
import { putNotificationById } from '@/api/admin/alerts-api'
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

  console.log('data', data)
  useEffect(() => {
    setData({ ...dataSelected })
  }, [dataSelected])

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

  console.log('dataSelected', equipments)
  console.log('dataSelected2', dataSelected)

  const nameArea = (id: string) => {
    areas?.map((obj) => {
      if (String(obj.id) === id) {
        setAreaSelected(obj.name)
      }
    })
  }

  useEffect(() => {
    nameArea(String(dataSelected?.inspection_data?.entity_id))
  }, [areas, dataSelected])

  const nameEquipment = (id: number) => {
    equipments?.map((obj) => {
      if (obj.equipment_id === id) {
        setEquipmentSelected(obj.name)
      }
    })
  }

  // revisar si es correcto o no
  useEffect(() => {
    nameEquipment(dataSelected?.inspection_data?.entity_id)
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
    nameCreator(String(dataSelected?.creator_id))
    nameSendTo(String(dataSelected?.send_to_id))
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

  const submitFData = async () => {
    setLoading(true)
    delete data.send_to_extra
    const newData = { ...data }
    const temp = {
      ...newData,
      message: `${newData.message}\n${session?.user.short_name}: ${solutionMessage}`,
      creator_id: users?.find((user) => user.username === data.creator_id)?.id,
      send_to: users
        ?.filter((user) => newData.send_to.includes(user.username))
        .map((user) => user.id)
        .join(',') , // convierte [1, 2, 3] en "1,2,3"
      extra_field: 'a'
    }

    console.log('temp', temp)
    const resp = await putNotificationById(Number(data.id), temp)
    if (resp.status === 200) {
      setLoading(false)
      setOpen(false)
      console.log('Notificación actualizada', resp)
    }
  }

  return (
    <div className={`w-[400px] max-h-[60vh] min-h-[60vh] bg-gray-200 text-black rounded-md p-2 mt-28 border-gray-400 border-2 shadow-lg flex flex-col gap-1 ${open ? '' : 'hidden'}`}>
      <div className='p-2 flex flex-row bg-[#002645] rounded-md justify-between items-center'>
        <h1 className='text-white font-bold'>Alerta #{data?.id}</h1>
        <button
          onClick={() => {
            setOpen(false)
          }}
          className='text-white font-bold'>
          <FaAngleDoubleRight size={25} />
        </button>
      </div>
      <div className='flex flex-col p-2 h-full overflow-auto'>
        <div className='flex flex-row gap-5 w-full h-full'>
          <div className='flex flex-col w-1/3 gap-3 my-2'>
            <Label className='font-bold'>Tipo:</Label>
            <RadioGroup className='flex flex-row gap-3 w-full pt-3' value={'1'} >
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
            <Label className='font-bold'>Área/Equipo:</Label>
            <Input disabled value={data?.inspection_data?.entity_id} />
          </div>
        </div>
        <div className='flex flex-row gap-5 w-full'>
          <div className='flex flex-col justify-center items-start w-1/2 gap-3 my-2'>
            <Label className='font-bold'>Estado:</Label>
            <Select
              value={String(data?.status)}
              disabled={!editNotify}
              onValueChange={(val) => {
                setData({ ...data, status: Number(val) })
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
            <Label className='font-bold'>Prioridad:</Label>
            <Select disabled value={String(data?.priority)}>
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
          <Label className='font-bold'>Creado por:</Label>
          <Input disabled value={data?.creator_id ?? ''} />
        </div>
        <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
          <Label className='font-bold'>Enviado a:</Label>
          <div className='flex flex-row gap-1 w-full bg-white p-2 rounded-md'>
            {
              data && data.send_to && data.send_to.length > 0 ? (
                data?.send_to?.map((user: string, index: number) => (
                  <span key={index} className='bg-gray-300 p-1 text-sm rounded-md'>{user}</span>
                ))
              ) : (
                <span className='text-sm p-1'>No hay usuarios asignados</span>
              )
            }
          </div>
        </div>
        <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
          <Label className='font-bold'>Título:</Label>
          <Input disabled value={data?.title} />
        </div>
        <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
          <Label className='font-bold'>Mensaje:</Label>
          <Textarea disabled value={data?.message} className='resize-none' />
          {
            editNotify
              ? <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
                <Label>Añadir mensaje:</Label>
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
        </div>
        <div className='flex flex-col justify-center items-start w-full my-2 gap-1 '>
          <Label className='font-bold'>Evidencias:</Label>
          <div className='flex flex-row gap-2 w-full h-40 overflow-x-auto'>
            {
              data && data.uploaded_files && data.uploaded_files.length > 0 ?
                data.uploaded_files.map((file: File, index: number) => (
                  <div key={index} className='bg-white w-40 h-40 rounded-md gap-1 p-2'>
                    <Image
                      width={300}
                      height={130}
                      src={file.file}
                      alt={`Evidencia ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                  </div>
                ))
                :
                <div className='bg-white w-full rounded-md gap-1 p-2 justify-center flex'>
                  <h1 className='italic'>No hay evidencias</h1>
                </div>
            }
          </div>
        </div>
        {

          <div className='flex flex-row items-center gap-2'>
            <Button
              disabled={!editNotify}
              onClick={() => { submitFData() }}>
              Guardar
            </Button>
            <Button
              // disabled={data.send_to_id !== session?.user.id && data.send_to !== null}
              onClick={() => { setEditNotify(!editNotify) }}>
              {editNotify ? 'Cancelar' : 'Actualizar'}
            </Button>
          </div>
        }
      </div>
    </div>
  )
}
