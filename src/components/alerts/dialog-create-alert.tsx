import React, { use, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '../ui/button'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '../ui/label'
import { useSession } from 'next-auth/react'
import { type EntityStructure } from '@/lib/utils'
import { getEntities } from '@/api/admin/entities-api'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
// import { postInspection, postNotification } from '@/api/admin/notifications-api'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { getUsers } from '@/api/admin/users-api'
import { getEquipments } from '@/api/admin/equipments-api'
import Spinner from '../ui/spinner'

interface DialogCreateNotifyAreaStruct {
  open: boolean
  setOpen: (value: boolean) => void
  idArea: any
  actualNode: any
}
export default function DialogCreateNotifyArea({ actualNode, idArea, open, setOpen }: DialogCreateNotifyAreaStruct) {
  const [selectionOption, setSelectionOption] = useState('')
  const { data: session } = useSession()
  const [areas, setAreas] = useState<EntityStructure[] | null>(null)
  const [equipments, setEquipments] = useState<any[] | null>(null)
  const [allUsers, setAllUsers] = useState<any[] | null>(null)


  const getAllAreas = async () => {
    try {
      const response = await getEntities()
      setAreas(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getAllEquipments = async () => {
    try {
      const response = await getEquipments()
      setEquipments(response.data.data)
      // console.log('EQUIPOS', response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  // revisar para que solamente sea cuando se seleccione el tipo de notificacion
  useEffect(() => {
    getAllAreas()
    getAllEquipments()
  }, [])


  const getAllUsers = async () => {
    try {
      const response = await getUsers()
      const temp = response.data.data.sort((a: any, b: any) => {
        if (a.short_name < b.short_name) {
          return -1
        }
        if (a.short_name > b.short_name) {
          return 1
        }
        return 0
      })

      setAllUsers(temp)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getAllUsers()
  }, [])

  // useEffect(() => {
  //   const temp = [...areas]
  //   temp.filter((obj) => {
  //     if (obj.parent_id === idArea) {
  //       setAreas()
  //     }
  //   })
  // }, [areas])


  const [inspectionData, setInspectionData] = useState({
    parameters: JSON.stringify({
      notification_type: 2,
      message: 'Notificación desde Gemelo'
    }),
    inspection_type: 1,
    entity_id: String(idArea),
    creator_id: session?.user.id,
    send_to_id: null
  })

  const [notificationData, setNotificationData] = useState<{
    title: string
    inspection_id: string
    status: string
    priority: string
    message: string
    creator_id: any
    extra_field: any
    send_to_id: any
    files: null | any[] | any
  }>({
    title: '',
    inspection_id: '',
    status: '1',
    priority: '',
    message: '',
    creator_id: session?.user.id,
    extra_field: null,
    send_to_id: null,
    files: null
  })
  const [userSelected, setUserSelected] = useState<any>(null)

  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const extraField = {
      node_id: actualNode
    }
    try {
      const response1 = await postInspection(inspectionData)

      if (response1.status === 201) {
        const sendNotifcation: any = {
          ...notificationData,
          inspection_id: response1.data.data.id,
          extra_field: JSON.stringify(extraField)
        }
        const formDataaa = new FormData()
        formDataaa.append('title', sendNotifcation.title)
        formDataaa.append('inspection_id', sendNotifcation.inspection_id)
        formDataaa.append('status', sendNotifcation.status)
        formDataaa.append('priority', sendNotifcation.priority)
        formDataaa.append('message', sendNotifcation.message)
        formDataaa.append('creator_id', sendNotifcation.creator_id)
        formDataaa.append('extra_field', sendNotifcation.extra_field)
        if (userSelected === '0') {
          formDataaa.append('send_to_id', '')
        } else {
          formDataaa.append('send_to_id', userSelected)
        }
        Array.from(sendNotifcation.files).forEach((file: any) => {
          formDataaa.append('files', file)
        })
        console.log('FORMDATA', sendNotifcation)
        const response2 = await postNotification(formDataaa)
        if (response2.status === 201) {
          setOpen(false)
          setLoading(false)
        }
      }
    } catch (error) {
      console.log('ERROR', error)
    }
  }


  const [typeNotify, setTypeNotify] = useState('1')

  const handleTypeNotify = (e: any) => {
    setTypeNotify(e)
  }

  const handleParameters = (e: any) => {
    setInspectionData({
      ...inspectionData,
      parameters: JSON.stringify({

        notification_type: e.target.value
      })
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px] bg-gray-200">
        <DialogHeader>
          <DialogTitle>Nueva notificación</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col w-full justify-center items-center '>
          <div className='flex flex-row gap-5 w-full h-full'>
            <div className='flex flex-col w-1/3 gap-3 my-2'>
              <Label>Tipo de notificación:</Label>
              <RadioGroup
                className='flex flex-row gap-3 w-full pt-3'
                value={typeNotify}
                onValueChange={(e) => {
                  handleTypeNotify(e)
                }}
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
              {
                (typeNotify === '1')
                  ? <>
                    <Select value={inspectionData.entity_id} onValueChange={(e) => {
                      setInspectionData({
                        ...inspectionData,
                        entity_id: e
                      })
                    }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione área ..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {
                            areas?.map((obj, index) => {
                              return (
                                <SelectItem key={index} value={String(obj.id)}>{obj.name}</SelectItem>
                              )
                            })
                          }
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </>
                  : <>
                    <Select
                      value={inspectionData.entity_id} onValueChange={(e) => {
                        setInspectionData({
                          ...inspectionData,
                          parameters: JSON.stringify({
                            notification_type: 1,
                            message: 'Notificación desde Gemelo para ' + equipments?.find((obj) => obj.id === e)?.name
                          }),
                          entity_id: e
                        })
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione equipo ..." />
                      </SelectTrigger>
                      <SelectContent className='w-[60%]'>
                        <SelectGroup>
                          {
                            equipments?.map((obj, index) => {
                              return (
                                <SelectItem key={index} value={String(obj.id)}>{obj.name}</SelectItem>
                              )
                            })
                          }
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </>
              }

            </div>

          </div>
          <div className='flex flex-row w-full gap-1 my-2 items-center'>
            {
              typeNotify === '1'
                ? null
                : <div className='flex flex-col w-full gap-1 my-2'>
                  <Label>Inspección:</Label>
                  <RadioGroup
                    defaultValue='1'
                    className='flex flex-row gap-3 w-full pt-3'
                  >
                    <div className='flex flex-row gap-2 w-1/2'>
                      <RadioGroupItem value='1' id='1' />
                      <Label>Sin insp.</Label>
                    </div>
                    <div className='flex flex-row gap-2 w-1/2'>
                      <RadioGroupItem value='2' id='2' />
                      <Label>Con insp.</Label>
                    </div>
                  </RadioGroup>
                </div>
            }
            {
              typeNotify === '1'
                ? null
                : <div className='flex flex-col w-full gap-1 my-2'>
                  <Label>Parámetro:</Label>
                  <Input />
                </div>
            }
          </div>
          <div className='flex flex-row gap-5 w-full'>
            <div className='flex flex-col justify-center items-start w-1/2 gap-3 my-2'>
              <Label>Estado:</Label>
              <Select disabled value={notificationData.status} onValueChange={(e) => {
                setNotificationData({
                  ...notificationData,
                  status: e
                })
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione ..." />
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
              <Label>Prioridad:</Label>
              <Select onValueChange={(e) => {
                setNotificationData({
                  ...notificationData,
                  priority: e
                })
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="4">Muy Alta</SelectItem>
                    <SelectItem value="3">Alta</SelectItem>
                    <SelectItem value="2">Media</SelectItem>
                    <SelectItem value="1">Baja</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
            {/* <div className='flex flex-col w-1/2 gap-1'> */}
            <Label>Creado por:</Label>
            <Input disabled value={session?.user?.short_name ?? ''} />
            {/* </div> */}
            {/* <div className='flex flex-col w-1/2 gap-1'>
              <Label>Cargo:</Label>
              <Input disabled />
            </div> */}
          </div>
          <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
            <Label>Enviado a:</Label>
            <Select
              value={userSelected}
              onValueChange={(e) => {
                setUserSelected(e)
              }}
            >
              <SelectTrigger >
                <SelectValue placeholder="Seleccione a quien enviar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={'0'}> -- TODOS -- </SelectItem>
                  {
                    allUsers?.map((obj, index) => {
                      return (
                        <SelectItem key={index} value={obj.id}>{obj.short_name}</SelectItem>
                      )
                    })
                  }
                </SelectGroup>
              </SelectContent>

            </Select>
          </div>
          <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
            <Label>Título:</Label>
            <Input value={notificationData.title} onChange={(e) => {
              setNotificationData({
                ...notificationData,
                title: e.target.value
              })
            }} />
          </div>
          <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
            <Label>Mensaje:</Label>
            <Textarea className='resize-none' value={notificationData.message} onChange={(e) => {
              setNotificationData({
                ...notificationData,
                message: e.target.value
              })
            }} />
          </div>
          <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
            <Label>Evidencias:</Label>
            <Input type='file' multiple={true} onChange={(e) => {
              setNotificationData({
                ...notificationData,
                files: e.target.files
              })
            }} />
          </div>
        </div>

        <DialogFooter className='flex flex-row justify-end  items-center gap-3'>
          {
            loading
              ? <div className='flex items-center gap-2'><Spinner />Cargando...</div>
              : null
          }
          <Button disabled={loading} type="button" onClick={async () => { await handleSubmit() }}> Guardar </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}
