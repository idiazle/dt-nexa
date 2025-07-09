'use client'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { FaCircle, FaSquare } from 'react-icons/fa6'
import { getEquipments } from '@/api/admin/equipments-api'
import { getUsers } from '@/api/admin/users-api'
import { getEntities } from '@/api/admin/entities-api'
import { Input } from '../ui/input'
import Spinner from '../ui/spinner'
import { Textarea } from '../ui/textarea'

interface DialogListNotifiesStructure {
  open: boolean
  setOpen: (value: boolean) => void
}

function DialogListNotifies({ open, setOpen }: DialogListNotifiesStructure) {
  const [notifies, setNotifies] = useState<any[]>([])
  const [areas, setAreas] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [equipments, setEquipments] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [modifiesNot, setModifiesNot] = useState<any[]>([])

  const getAllNotificationsData = () => {
    // getNotifications().then((response) => {
    //   const temp = response.data.data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    //   setNotifies(temp)
    // }).catch((error) => {
    //   console.log(error)
    //   setNotifies([])
    // })
    // getEntities().then((response) => {
    //   setAreas(response.data.data)
    // })
    // getUsers().then((response) => {
    //   setUsers(response.data.data)
    // })
    // getEquipments().then((response) => {
    //   setEquipments(response.data.data)
    // })
  }

  useEffect(() => {
    if (open) {
      getAllNotificationsData()
    }
    if (!open) {
      setNotifies([])
      setAreas([])
      setUsers([])
      setEquipments([])
    }
  }, [open])

  const getAreaName = (id: number) => {
    const area = areas.find(area => area.id === id)
    return area?.name
  }

  const getUserName = (id: number) => {
    const user = users.find(user => user.id === id)
    return user?.short_name
  }

  const getEquipmentName = (id: number) => {
    const equipment = equipments.find(equipment => equipment.id === id)
    return String(equipment?.name).charAt(0).toUpperCase() + String(equipment?.name).slice(1).toLowerCase()
  }

  const getPrio = (status: number) => {
    switch (status) {
      case 0:
        return <FaCircle className='text-gray-500' />
      case 1:
        return <FaCircle className='text-green-500' />
      case 2:
        return <FaCircle className='text-yellow-500' />
      case 3:
        return <FaCircle className='text-orange-500' />
      case 4:
        return <FaCircle className='text-red-500' />
      default:
        return <FaCircle className='text-red-500' />
    }
  }

  const modifyNotifications = () => {
    const temp = notifies.map((notify) => {
      return {
        ...notify,
        priority: getPrio(Number(notify.priority)),
        type: notify?.inspection_data.entity_type === 3 ? 'Equipo' : 'Área',
        entity: getAreaName(Number(notify?.inspection_data.entity_id)) || getEquipmentName(Number(notify?.inspection_data.entity_id)),
        creator: getUserName(Number(notify.creator_id)),
        send_to: notify.send_to_id !== null ? getUserName(Number(notify.send_to_id)) : 'General',
        // status: notify.status === 0 ? 'Atendido' : 'No Atendido'
        status: notify.status === 0
          ? <div className='flex flex-row gap-2 items-center'> <FaSquare className='text-green-500'></FaSquare> Atendido</div>
          : <div className='flex flex-row gap-2 items-center'><FaSquare className='text-red-500'></FaSquare>No atendido</div>
      }
    })
    setModifiesNot(temp)
  }

  useEffect(() => {
    if (notifies.length > 0 && areas.length > 0 && users.length > 0 && equipments.length > 0) {
      modifyNotifications()
      setLoading(false)
    } else {
      setModifiesNot([])
    }
  }, [notifies, areas, users, equipments])

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false)
        setLoading(true)
      }}>
      <DialogContent className='flex flex-col max-h-[75vh] min-h-[75vh] max-w-[80vw] justify-start bg-gray-100'>
        <DialogHeader className='flex flex-row gap-10 items-center pr-5'>
          <DialogTitle>Notificaciones</DialogTitle>
          {
            loading && <div className='flex flex-row gap-3 items-center italic font'> <Spinner />Cargando informacion ...</div>
          }
        </DialogHeader>
        <div className='overflow-auto'>
          <Table>
            <TableHeader className='bg-gray-200'>
              <TableRow>
                <TableHead className='w-[50px]'>Prio.</TableHead>
                <TableHead>Not. N°</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className='w-[200px]'>Área/Equipo</TableHead>
                <TableHead className='w-[250px]'>Nombre</TableHead>
                <TableHead>Creado por</TableHead>
                <TableHead>Enviado a</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Mensaje/Soluciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='bg-white'>
              {
                modifiesNot.length > 0
                  ? modifiesNot.map((notify, index) => (
                    <TableRow key={index}>
                      <TableCell className='w-[50px]'>{notify?.priority}</TableCell>
                      <TableCell>{notify.id}</TableCell>
                      <TableCell>{notify.type}</TableCell>
                      <TableCell className='w-[200px]'>{notify.entity}</TableCell>
                      <TableCell className='w-[250px]'>{notify.title}</TableCell>
                      <TableCell>{notify?.creator}</TableCell>
                      <TableCell>{notify.send_to}</TableCell>
                      <TableCell>{notify.status}</TableCell>
                      <TableCell>
                        <Textarea className='resize-none' value={notify.message} readOnly />
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
      </DialogContent>
    </Dialog>
  )
}

export default DialogListNotifies
