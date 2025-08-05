'use client'
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { FaCheck, FaCircle, FaPlus, FaRegCalendar, FaSquare } from 'react-icons/fa6'
import DialogListNotifies from './dialog-list-alerts'
import DialogInfoNotify from './dialog-info-alert'
import DialogCreateNotifyArea from './dialog-create-alert'
import { Separator } from '../ui/separator'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Textarea } from '../ui/textarea'
import { getAllAlerts, postInspection, postNotification } from '@/api/admin/alerts-api'
import Image from 'next/image'
import { FaAngleDoubleRight, FaEye, FaTimes } from 'react-icons/fa'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { getUsers } from '@/api/admin/users-api'
import { getEquipments } from '@/api/admin/equipments-api'
import { useSession } from 'next-auth/react'
import { MultiSelect } from '../ui/multiselect'
import Spinner from '../ui/spinner'
import { useToast } from '../ui/use-toast'

interface AlertsListProps {
  openAlertsView: boolean
  setOpenAlertsView: (open: boolean) => void
}

type Alert = {
  title: string
  inspection_data?: {
    entity_id: number
  }
  id: number
  priority: number
  status: number
  message: string
  created_at: string
  creator_id: number
  send_to: [string]
  extra_field: string
  uploaded_files: Array<{
    id: number
    file: string
  }>
}

const AlertsList = ({ openAlertsView, setOpenAlertsView }: AlertsListProps) => {
  const { data: session } = useSession()
  const [selectedAlert, setSelectedAlert] = React.useState<Alert | null>(null)
  const [filterNotifies, setFilterNotifies] = React.useState('0')
  const [openCreateAlert, setOpenCreateAlert] = React.useState(false)
  const [actualNode, setActualNode] = React.useState(null)
  const [openAlert, setOpenAlert] = React.useState<number | boolean | null >(false)
  const refSpheere = React.useRef(null)
  const [allAlerts, setAllAlerts] = useState<Alert[]>([])
  const [openAllAlerts, setOpenAllAlerts] = useState(false)
  const [modifiesAlerts, setModifiesAlerts] = useState<any[]>([])
  const [alertData, setAlertData] = useState<{
    title: string
    inspection_id: string
    status: string
    priority: string
    message: string
    creator_id: any
    extra_field: any
    send_to: any
    files: null | any[] | any
  }>({
    title: '',
    inspection_id: '',
    status: '1',
    priority: '',
    message: '',
    creator_id: session?.user.id,
    extra_field: null,
    send_to: null,
    files: null
  })
  const [alertDataEdit, setAlertDataEdit] = useState<{
    title: string
    inspection_id: string
    status: string
    priority: string
    message: string
    creator_id: any
    extra_field: any
    send_to: any
    files: null | any[] | any
  }>({
    title: '',
    inspection_id: '',
    status: '1',
    priority: '',
    message: '',
    creator_id: null,
    extra_field: null,
    send_to: null,
    files: null
  })

  const [equipmentList, setEquipmentList] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])


  useEffect(() => {
    if (openAlertsView) {
      const fetchAlerts = () => {
        getAllAlerts()
          .then(response => {
            console.log('Alerts fetched:', response.data.data)
            setAllAlerts(response.data.data)
          })
          .catch(error => {
            console.error('Error fetching alerts:', error)
          })
      }
      fetchAlerts()
    }
    // else {
    //   setAllAlerts([])
    //   setOpenAlert(null)
    //   setSelectedAlert(null)
    //   setOpenCreateAlert(false)
    // }
  }, [openAlertsView])

  useEffect(() => {
    getUsers()
      .then(response => {
        const users = response.data.data;
        setUsers(users);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [allAlerts]);

  useEffect(() => {
    getEquipments().then(response => {
      const equipments = response.data.data;
      console.log('Equipments fetched:', equipments);
      setEquipmentList(equipments);
    })
  }, [])

  const nameEquipmentView = (id: number) => {
    const equipment = equipmentList.find(e => e.equipment_id === id);
    return equipment ? `${equipment.tag} - ${equipment.name}` : 'Equipo no encontrado';
  }

  const nameUserView = (id: number) => {
    const user = users.find(u => u.id === id);
    return user ? user.username : 'Usuario no encontrado';
  }

  const nameSendToView = (array: string) => {
    try {
      const sendToIds = JSON.parse(array);
      if (Array.isArray(sendToIds)) {
        return sendToIds.map((id: number) => {
          const user = users.find((u: any) => u.id === id);
          return user ? user.username : id.toString();
        }).join(', ');
      }
    } catch (err) {
      console.warn('Error parsing send_to', array);
    }
    return 'No asignado';
  }
  // const filterDataNotifies = modifiesAlerts.filter(notify => {
  //   if (filterNotifies === '0') return true
  //   return notify.priority === parseInt(filterNotifies)
  // })

  const changesAllAlerts = () =>{
    getAllAlerts().then(response => {
      const alerts = response.data.data;
      console.log('Alerts fetched:', alerts);
      setAllAlerts(alerts);
    })
  }

  const noAttendedAlerts = allAlerts.filter(notify => notify.status === 1)
  const attendedAlerts = allAlerts.filter(notify => notify.status === 0)
  const [usersSelected, setUsersSelected] = useState<number[]>([])

  const [inspectionData, setInspectionData] = useState({
    parameters: JSON.stringify({
      notification_type: 2,
      message: 'Notificación desde Gemelo'
    }),
    inspection_type: 1,
    entity_id: '',
    creator_id: alertData?.creator_id,
  })

  const [loading, setLoading] = useState(false)

  const [attendedAlertOption, setAttendedAlertOption] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const extraField = {
      node_id: actualNode
    }
    try {
      const response1 = await postInspection(inspectionData)

      if (response1.status === 201) {
        const sendNotifcation: any = {
          ...alertData,
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
        formDataaa.append('send_to', '[' + usersSelected.toString() + ']')
        Array.from(sendNotifcation.files).forEach((file: any) => {
          formDataaa.append('files', file)
        })
        console.log('FORMDATA', sendNotifcation)
        const response2 = await postNotification(formDataaa)
        if (response2.status === 201) {
          // console.log('Notification sent successfully', response2.data);
          setOpenCreateAlert(false)
          setLoading(false)
        }
      }
    } catch (error) {
      console.log('ERROR', error)
    }
  }

  useEffect(() => {
    if (selectedAlert?.status === 0) {
      setAttendedAlertOption(true)
      setAlertDataEdit({
        title: selectedAlert.title,
        inspection_id: selectedAlert.inspection_data?.entity_id?.toString() ?? '',
        status: selectedAlert.status?.toString() ?? '',
        priority: selectedAlert.priority?.toString() ?? '',
        message: selectedAlert.message,
        creator_id: selectedAlert.creator_id,
        extra_field: selectedAlert.extra_field,
        send_to: selectedAlert.send_to,
        files: null
      })
    } else {
      setAttendedAlertOption(false)
    }
  }, [selectedAlert])

  return (
    <div className='flex flex-row absolute z-50 top-14 right-1 gap-2 items-start'>
      {/* lista general de alertas */}
      <div className={`w-[1000px] max-h-[60vh] min-h-[60vh] bg-gray-200 text-black rounded-md p-2 mt-28 border-gray-400 border-2 shadow-lg flex flex-col gap-2 ${openAllAlerts ? '' : 'hidden'}`}>
        <div className='p-2 flex flex-row bg-[#002645] rounded-md justify-between items-center'>
          <h1 className='text-white font-bold'>Historial de alertas</h1>
          <button
            onClick={() => {
              setOpenAllAlerts(false)
            }}
            className='text-white font-bold'>
            <FaAngleDoubleRight size={25} />
          </button>
        </div>
        <div className='overflow-auto'>
          <Table>
            <TableHeader className='bg-gray-200'>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead className='w-[50px]'>Prio.</TableHead>
                {/* <TableHead>Tipo</TableHead> */}
                <TableHead className='w-[200px]'>Área/Equipo</TableHead>
                <TableHead className='w-[250px]'>Nombre</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead>Enviado</TableHead>
                <TableHead>Estado</TableHead>
                {/* <TableHead>Mensaje/Soluciones</TableHead> */}
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='bg-white'>
              {
                allAlerts.length > 0
                  ? allAlerts?.map((notify, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className='w-[50px]'>{
                        notify?.priority === 1 ? <FaCircle size={20} className='text-green-500' /> :
                          notify?.priority === 2 ? <FaCircle size={20} className='text-yellow-500' /> :
                            notify?.priority === 3 ? <FaCircle size={20} className='text-orange-500' /> :
                              notify?.priority === 4 ? <FaCircle size={20} className='text-red-500' /> :
                                <FaCircle size={20} className='text-gray-500' />
                      }</TableCell>
                      {/* <TableCell>{notify.type}</TableCell> */}
                      <TableCell className='w-[200px]'>{nameEquipmentView(Number(notify.inspection_data?.entity_id))}</TableCell>
                      <TableCell className='w-[200px]'>{notify.title}</TableCell>
                      <TableCell>{nameUserView(Number(notify?.creator_id))}</TableCell>
                      <TableCell>
                        <div className='flex flex-row gap-1'>
                          <span className='bg-gray-200 p-1 rounded-lg'>
                            {
                              nameSendToView((notify.send_to).toString())
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='flex flex-row gap-1 items-center'>
                        {notify.status === 0 ? <FaCheck className='text-green-500' /> : <FaTimes className='text-red-500' />}{notify.status === 0 ? 'Atendido' : "No atendido"}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            setSelectedAlert(notify)
                            setOpenAlert(true)
                          }}
                        >
                          <FaEye size={20} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                  : <TableRow>
                    <TableCell colSpan={9} className='text-center'>No hay notificaciones</TableCell>
                  </TableRow>
              }
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Arir alerta de lista */}
      {
        selectedAlert && (
          <DialogInfoNotify open={!!openAlert} setOpen={setOpenAlert} dataSelected={selectedAlert} setAllAlerts={setAllAlerts} />
        )
      }

      {/* <div className={`w-[400px] max-h-[60vh] min-h-[60vh] bg-gray-200 text-black rounded-md p-2 mt-28 border-gray-400 border-2 shadow-lg flex flex-col gap-1 ${openAlert ? '' : 'hidden'}`}>
        <div className='p-2 flex flex-row bg-[#002645] rounded-md justify-between items-center'>
          <h1 className='text-white font-bold'>Alerta #{selectedAlert?.id}</h1>
          <button
            onClick={() => {
              setOpenAlert(false)
              setSelectedAlert(null)
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
              <Input disabled value={alertDataEdit?.inspection_data?.entity_id ?? ''} />
            </div>
          </div>
          <div className='flex flex-row gap-5 w-full'>
            <div className='flex flex-col justify-center items-start w-1/2 gap-3 my-2'>
              <Label className='font-bold'>Estado:</Label>
              <Select
                value={String(alertDataEdit?.status)}
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
              <Select disabled value={String(alertDataEdit?.priority)}>
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
            <Input disabled value={alertDataEdit?.creator_id ?? ''} />
          </div>
          <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
            <Label className='font-bold'>Enviado a:</Label>
            <div className='flex flex-row gap-1 w-full bg-white p-2 rounded-md'>
              {
                alertDataEdit && alertDataEdit.send_to && alertDataEdit.send_to.length > 0 ? (
                  alertDataEdit?.send_to?.map((user: string, index: number) => (
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
            <Input disabled value={alertDataEdit?.title} />
          </div>
          <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
            <Label className='font-bold'>Mensaje:</Label>
            <Textarea disabled value={alertDataEdit?.message} className='resize-none' />
          </div>
          {
            attendedAlertOption &&
            <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
              <Label className='font-bold'>Nuevo mensaje:</Label>
              <Textarea value={selectedAlert?.message} className='resize-none' />
            </div>
          }
          <div className='flex flex-col justify-center items-start w-full my-2 gap-1 '>
            <Label className='font-bold'>Evidencias:</Label>
            <div className='flex flex-row gap-2 w-full h-40 overflow-x-auto'>
              {
                selectedAlert && selectedAlert.uploaded_files && selectedAlert.uploaded_files.length > 0 ?
                  selectedAlert.uploaded_files.map((file, index) => (
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
            attendedAlertOption && selectedAlert?.status === 0 && (
              <div className='flex flex-row items-center gap-2'>
                <Button
                  onClick={() => {
                    console.log('Atender Alert', selectedAlert?.id)

                  }}
                  className='w-full'>
                  Actualizar
                </Button>
                <Button
                  onClick={() => {
                    // setOpenAlert(null)
                    // setSelectedAlert(null)

                  }}
                  variant='destructive'
                  className='w-full'>
                  Limpiar
                </Button>
              </div>
            )
          }
        </div>
      </div> */}

      {/* Crear nueva alerta */}
      <div className={`w-[400px] max-h-[60vh] min-h-[60vh] bg-gray-200 text-black rounded-md p-2 mt-28 border-gray-400 border-2 shadow-lg flex flex-col gap-1 ${openCreateAlert ? '' : 'hidden'}`}>
        <div className='p-2 flex flex-row bg-[#002645] rounded-md justify-between items-center'>
          <h1 className='text-white font-bold'>Nueva Alerta</h1>
          <button
            onClick={() => {
              setOpenCreateAlert(false)
              setAlertData({
                title: '',
                inspection_id: '',
                status: '1',
                priority: '',
                message: '',
                creator_id: session?.user.id,
                extra_field: null,
                send_to: null,
                files: null
              })
              setInspectionData({
                parameters: JSON.stringify({
                  notification_type: 2,
                  message: 'Notificación desde Gemelo'
                }),
                inspection_type: 1,
                entity_id: '',
                creator_id: session?.user.id,
              })
            }}
            className='text-white font-bold'>
            <FaAngleDoubleRight size={25} />
          </button>
        </div>
        <div className='flex flex-col p-2 h-full overflow-auto rounded-md'>
          <div className='flex flex-row gap-5 w-full h-full'>
            <div className='flex flex-col w-1/3 gap-3 my-2'>
              <Label className='font-bold'>Tipo:</Label>
              <RadioGroup className='flex flex-row gap-3 w-full pt-3' value={'1'}>
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
              <Label className='font-bold'>Equipo:</Label>
              <Select
                value={inspectionData.entity_id}
                onValueChange={(e) => {
                  setInspectionData({
                    ...inspectionData,
                    entity_id: e
                  })
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un equipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {equipmentList.map((equipment) => (
                      <SelectItem key={equipment.id} value={String(equipment.equipment_id)}>
                        {equipment.tag}-{equipment.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='flex flex-row gap-5 w-full'>
            <div className='flex flex-col justify-center items-start w-1/2 gap-3 my-2'>
              <Label className='font-bold'>Estado:</Label>
              <Select disabled value={String(alertData?.status)} onValueChange={(value) => setAlertData({ ...alertData, status: value })}>
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
              <Select value={String(alertData?.priority)} onValueChange={(value) => setAlertData({ ...alertData, priority: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="-- Seleccione --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">Alta</SelectItem>
                    <SelectItem value="2">Media</SelectItem>
                    <SelectItem value="3">Baja</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
            <Label className='font-bold'>Creado por:</Label>
            <Input disabled value={session?.user?.username ?? ''} />
          </div>
          <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
            <Label className='font-bold'>Enviado a:</Label>
            <MultiSelect
              options={users.map(user => user.short_name)}
              selected={usersSelected.map(id => users.find(user => user.id === id)?.short_name || '')}
              onChange={(selected) => {
                const selectedIds = selected.map(name => {
                  const user = users.find(user => user.short_name === name);
                  return user ? user.id : null;
                }).filter(id => id !== null);
                setUsersSelected(selectedIds);
              }}
              placeholder="Buscar usuario"
            />

          </div>
          <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
            <Label className='font-bold'>Título:</Label>
            <Input value={alertData?.title ?? ''} onChange={(e) => setAlertData({ ...alertData, title: e.target.value })} />
          </div>
          <div className='flex flex-col justify-center items-start w-full gap-1 my-2'>
            <Label className='font-bold'>Mensaje:</Label>
            <Textarea className='resize-none' value={alertData?.message} onChange={(e) => setAlertData({ ...alertData, message: e.target.value })} />
          </div>
          <div className='flex flex-col justify-center items-start w-full my-2 gap-1 '>
            <Label className='font-bold'>Evidencias:</Label>
            <Input
              type='file'
              accept='image/*'
              multiple
              onChange={(e) => {
                setAlertData({ ...alertData, files: e.target.files });
              }}
            />
          </div>
          <div className='flex flex-row justify-end  items-center gap-2'>
            {
              loading
                ? <div className='flex items-center gap-2'><Spinner />Cargando...</div>
                : null
            }
            <Button className='w-full' disabled={loading} type="button" onClick={async () => { await handleSubmit() }}> Guardar </Button>
            <Button className='w-full' disabled={loading} onClick={() => { console.log('Limpiando...') }} variant='destructive'> Limpiar </Button>
          </div>
        </div>
      </div>

      {/* Lista de alertas no atendidas */}
      {
        openAlertsView && (
          <div className='flex flex-col min-h-[80vh] max-h-[80vh]  w-[300px] bg-gray-200  text-black rounded-md p-1 border-gray-400 border-2 shadow-lg'>
            <div className='p-2 flex flex-col bg-[#002645] rounded-md mb-2'>
              <h1 className='text-white font-bold'>ALERTAS</h1>
            </div>
            <div className='w-full flex flex-row justify-start gap-2'>
              <Button
                title='Crear notificación'
                className={`w-full bg-white text-black hover:bg-gray-500 hover:text-white gap-2 ${openCreateAlert ? 'bg-[#002645] text-white' : ''}`} onClick={() => { setOpenCreateAlert(!openCreateAlert) }}>
                <FaPlus size={15} />
                <h6>Nueva alerta</h6>
              </Button>
              {
                session?.user.groups.includes(1)
                  ? <Button
                    title='Historial de notificaciones'
                    className={`w-full bg-white text-black hover:bg-gray-500 hover:text-white gap-2 ${openAllAlerts ? 'bg-[#002645] text-white' : ''}`}
                    onClick={() => { setOpenAllAlerts(!openAllAlerts) }}>
                    <FaRegCalendar size={15} />
                    <h6>Historial</h6>
                  </Button>
                  : null
              }
            </div>
            <Separator className='bg-black my-2' />
            <div className='flex flex-row gap-2 items-center mb-2'>
              <h1 className='w-1/3 text-sm font-bold'>Prioridad:</h1>
              <div className='w-2/3'>
                <Select value={filterNotifies} onValueChange={(e) => { setFilterNotifies(e) }}>
                  <SelectTrigger className='p-2 w-full rounded-md'>
                    <SelectValue placeholder='Seleccione...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='0'>Todos</SelectItem>
                      <SelectItem value='4'>Bajo</SelectItem>
                      <SelectItem value='3'>Medio</SelectItem>
                      <SelectItem value='2'>Alto</SelectItem>
                      <SelectItem value='1'>Muy Alto</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='flex flex-col overflow-auto gap-1 mt-1' >
              {
                noAttendedAlerts?.length === 0
                  ? <div className='flex flex-row justify-center items-center w-full h-full py-5'>
                    <h1 className='italic'>No hay notificaciones</h1>
                  </div>
                  : (filterNotifies !== '0'
                    ? noAttendedAlerts?.map((notify, index) => {
                      return (
                        <button
                          key={index}
                          className={`bg-white rounded-md border border-gray-400 hover:bg-slate-100 flex flex-col gap-2 ${Number(notify.send_to) === session?.user.id ? 'bg-red-200' : ''}`}
                          onClick={() => {
                            if (openAlert === notify.id) {
                              setOpenAlert(false)
                              setSelectedAlert(null)
                            } else {
                              setOpenAlert(true)
                              setSelectedAlert(notify)
                              console.log('Selected Alert:', notify)
                            }
                          }}
                        >
                          <div className={` h-2 rounded-t-sm ${notify.priority === 4 ? 'bg-red-500' : notify.priority === 3 ? 'bg-orange-500' : notify.priority === 2 ? 'bg-yellow-500' : notify.priority === 1 ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                          <div className='flex flex-row justify-between w-full px-1'>
                            <div className='flex flex-row font-bold items-start w-2/3'>
                              <h6 className='text-xs'>Alerta #{notify.id}</h6>
                            </div>
                            <div className=' flex flex-col w-1/3 items-end font-bold'>
                              <h6 className='text-xs'>{notify.created_at.split('T')[0]}</h6>
                            </div>
                          </div>
                          <div className='flex flex-col items-start w-full px-1 mb-2'>
                            <div className='text-sm'>
                              {
                                notify?.inspection_data?.entity_id
                                  ? nameEquipmentView(Number(notify?.inspection_data.entity_id))
                                  : 'Equipo no encontrado'
                              }
                            </div>
                            <div className='text-sm'>{notify.title}</div>
                          </div>
                        </button>
                      )
                    })
                    : noAttendedAlerts?.length === 0
                      ? <div className='flex flex-row justify-center items-center w-full h-full py-5'>
                        <h1 className='italic'>No hay notificaciones</h1></div>
                      : noAttendedAlerts?.map((notify, index) => {
                        return (
                          <button
                            key={index}
                            className={`bg-white rounded-md border border-gray-400 hover:bg-slate-100 flex flex-col gap-2 ${Number(notify.send_to) === session?.user.id ? 'bg-red-200' : ''}`}
                            onClick={() => {
                              if (openAlert === notify.id) {
                                setOpenAlert(null)
                                setSelectedAlert(null)
                              } else {
                                setOpenAlert(notify.id)
                                setSelectedAlert(notify)
                                console.log('Selected Alert:', notify)
                              }
                            }}
                          >
                            <div className={` h-2 rounded-t-sm ${notify.priority === 4 ? 'bg-red-500' : notify.priority === 3 ? 'bg-orange-500' : notify.priority === 2 ? 'bg-yellow-500' : notify.priority === 1 ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                            <div className='flex flex-row justify-between w-full px-1'>
                              <div className='flex flex-row font-bold items-start w-2/3'>
                                <h6 className='text-xs'>Alerta #{notify.id}</h6>
                              </div>
                              <div className=' flex flex-col w-1/3 items-end font-bold'>
                                <h6 className='text-xs'>{notify.created_at.split('T')[0]}</h6>
                              </div>
                            </div>
                            <div className='flex flex-col items-start w-full px-1 mb-2'>
                              <div className='text-sm'>
                                {
                                  notify?.inspection_data?.entity_id ? nameEquipmentView(notify.inspection_data.entity_id) : 'Equipo no encontrado'
                                }
                              </div>
                              <div className='text-sm'>{notify.title}</div>
                            </div>
                          </button>
                        )
                      }))
              }
            </div>
          </div>)
      }
    </div>
  )
}

export default AlertsList