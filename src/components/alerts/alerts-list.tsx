import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { FaCircle, FaPlus, FaRegCalendar, FaSquare } from 'react-icons/fa6'
import DialogListNotifies from './dialog-list-alerts'
import DialogInfoNotify from './dialog-info-alert'
import DialogCreateNotifyArea from './dialog-create-alert'

interface AlertsListProps {
  openAlerts: boolean
  setOpenAlerts: (open: boolean) => void
}

const AlertsList = ({ openAlerts, setOpenAlerts }: AlertsListProps) => {
  const [filterNotifies, setFilterNotifies] = React.useState('0')
  const [dialogCreateNotif, setDialogCreateNotif] = React.useState(false)
  const [openAllNotifies, setOpenAllNotifies] = React.useState(false)
  const [selectedNotif, setSelectedNotif] = React.useState(null)
  const [actualNode, setActualNode] = React.useState(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const refSpheere = React.useRef(null)
  const session = { user: { id: 1, groups: [1] } } // Mock session data
  const nodes = [{ id: 1, panorama: 'panorama1' }] // Mock nodes data
  const notifiesNA = [
    { id: 1, priority: 2, status: 0, title: 'Notification 1', message: 'Message 1', created_at: '2023-10-01T12:00:00.000Z', send_to_id: 1, extra_field: '{"node_id": 1}' },
    { id: 2, priority: 3, status: 1, title: 'Notification 2', message: 'Message 2', created_at: '2023-10-02T12:00:00.000Z', send_to_id: 2, extra_field: '{"node_id": 1}' }
  ] // Mock notifications data

  const filterDataNotifies = notifiesNA.filter(notify => {
    if (filterNotifies === '0') return true
    return notify.priority === parseInt(filterNotifies)
  })


  return (
    <div className='absolute z-50 top-16 right-2'>
      {
        openAlerts
          ? <div className='flex flex-col h-[80vh] sm:h-[75vh] w-[300px] bg-[#020817] bg-opacity-80 text-black rounded-md p-2'>
            <div className='flex flex-row gap-2 items-center'>
              <h1 className='text-white w-1/3 text-sm font-bold'>Prioridad:</h1>
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
            <div className='w-full flex flex-col justify-start mt-2 gap-2'>
              <Button className='w-full bg-white text-black hover:bg-gray-200 gap-2' onClick={() => { setDialogCreateNotif(true) }}>
                <FaPlus size={15} />
                <h6>Nueva notificación</h6>
              </Button>
              {
                session.user?.groups.includes(1)
                  ? <Button className='w-full bg-white text-black hover:bg-gray-200 gap-2' onClick={() => { setOpenAllNotifies(true) }}>
                    <FaRegCalendar size={15} />
                    <h6>Historial</h6>
                  </Button>
                  : null
              }
            </div>
            <div className='flex flex-col gap-2 overflow-auto my-2' >
              {
                filterDataNotifies?.length === 0
                  ? <div className='flex flex-row justify-center items-center w-full h-full py-5'>
                    <h1 className='text-white'>No hay notificaciones</h1>
                  </div>
                  : (filterNotifies !== '0'
                    ? filterDataNotifies?.map((notify, index) => {
                      return (
                        <button key={index}
                          className='bg-gray-200 rounded-sm border-2 border-gray-400 p-2 flex flex-col gap-2'
                          onClick={() => {
                            setDialogOpen(true)
                            setSelectedNotif(notify)
                          }}>
                          <div className='flex flex-row justify-between w-full'>
                            <div className='flex flex-row font-bold items-center gap-1 w-1/3'>
                              <FaCircle className={`${notify.priority === 1 ? 'text-red-500' : notify.priority === 2 ? 'text-orange-500' : notify.priority === 3 ? 'text-yellow-500' : notify.priority === 4 ? 'text-green-500' : 'text-gray-500'}`} size={20} />
                              <h6 className='text-xs'>Alt. #{notify.id}</h6>
                            </div>
                            <div className=' flex w-1/3 justify-center text-xs'>{notify.created_at.split('T')}</div>
                            {/* <FaSquare className={`${notify.status === 0 ? 'text-green-500' : 'text-red-500'}`} size={20} /> */}
                          </div>
                          <div className='text-sm'>{notify.title}</div>
                          <div className='text-xs'>{notify.message}</div>
                        </button>
                      )
                    })
                    : notifiesNA?.length === 0
                      ? <div className='flex flex-row justify-center items-center w-full h-full py-5'>
                        <h1 className='text-white'>No hay notificaciones</h1></div>
                      : notifiesNA?.map((notify, index) => {
                        const extraInfo = JSON.parse(notify.extra_field)
                        return (
                          <button key={index}
                            className={`bg-gray-200 rounded-sm border-2 border-gray-400 p-2 flex flex-col gap-2 ${notify.send_to_id === session.user.id ? 'bg-red-200' : ''}`}
                            onClick={() => {
                              setDialogOpen(true)
                              setSelectedNotif(notify)
                            }}
                          >
                            <div className='flex flex-row justify-between w-full'>
                              <div className='flex flex-row font-bold items-center gap-1 w-1/3'>
                                <FaCircle className={`${notify.priority === 4 ? 'text-red-500' : notify.priority === 3 ? 'text-orange-500' : notify.priority === 2 ? 'text-yellow-500' : notify.priority === 1 ? 'text-green-500' : 'text-gray-500'}`} size={20} />
                                <h6 className='text-xs'>Alt. #{notify.id}</h6>
                              </div>
                              <div className=' flex flex-col w-1/3 justify-start text-xs'>
                                <h6>{notify.created_at.split('T')[0]}</h6>
                                <h6>{notify.created_at.split('T')[1].split('.')[0]}</h6>
                              </div>

                              {/* <button
                                className='bg-gray-200 rounded-sm p-1 flex flex-row gap-1 items-center'
                                onClick={() => {
                                  const nodeId = extraInfo.node_id
                                  const selectedNode = nodes?.find((obj) => obj.id === nodeId)
                                  if (selectedNode) {
                                    setActualNode(selectedNode.id)
                                    refSpheere.current?.setPanorama(selectedNode.panorama)
                                  }
                                }}
                              >
                                <h6 className='text-xs'>Nodo: {extraInfo?.node_id}</h6>
                                <FaSquare className={`${notify.status === 0 ? 'text-green-500' : 'text-red-500'}`} size={20} />
                              </button> */}
                            </div>
                            <div className='text-sm'>{notify.title}</div>
                            <div className='text-xs'>{notify.message}</div>
                          </button>
                        )
                      }))
              }
            </div>
          </div>
          : null
      }
      {
        <DialogListNotifies open={openAllNotifies} setOpen={setOpenAllNotifies} />
      }
      {
        dialogOpen && selectedNotif !== null
          ? <DialogInfoNotify open={dialogOpen} setOpen={setDialogOpen} dataSelected={selectedNotif} />
          : null
      }
      {
        dialogCreateNotif
          ? <DialogCreateNotifyArea actualNode={actualNode} idArea={12} open={dialogCreateNotif} setOpen={setDialogCreateNotif} />
          : null
      }
    </div>
  )
}

export default AlertsList